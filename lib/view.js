/*global $ _*/
const Debug = require('debug');
const format = require('util').format;
const Backbone = require('backbone');

const PluginText = require('./plugin/text');
const PluginInputText = require('./plugin/input-text');
const PluginCheckbox = require('./plugin/checkbox');

const delegateEventSplitter = /^(\S+)\s*(.*)$/;
const childEventSplitter = /^\@(\w+)\s*(.*)$/;
const DEFAULT_ATTR_TYPE = 'text';

const viewMount = function() {
  const tagName = this.tagName || 'div';
  const _this = this;
  
  let renderData = this.getModel();
  let container = this.container;
  let template = this.template || '';
  let domStr;
  let $dom;
  
  if (!container) {
    throw '필수값 [container] 누락';
  }
  
  if (typeof this.viewWillMount === 'function') {
    renderData = this.viewWillMount(renderData) || renderData;
  }
  
  if (typeof template === 'string') {
    domStr = template;
  } else {
    domStr = template(renderData);
  }
  
  $dom = $(`<${tagName}>${domStr}</${tagName}>`);
  
  if (!!this.className) {
    $dom.addClass(this.className);
  }
  
  if (typeof container === 'string') {
    container = $(container);
  }
  
  if (!!this.append) {
    container.append($dom);
  } else {
    container.html($dom);
  }
  
  this.setElement($dom);
  
  if (typeof this.viewDidMount === 'function') {
    this.viewDidMount($dom);
  }
  
  _.delay(function() {
    _this._viewMounted = true;
    _this._bindModel();
    
    _this.trigger('viewDidMount');
  }, 1);
};

var View = Backbone.View.extend({
  super() {
    View.prototype.initialize.apply(this, arguments);
  },

  initialize() {
    this._viewMounted = false;
    this._views = {};
    this._events = this._events || {};
    // this.debug = this['namespace'] ? Debug(this['namespace']) : Debug('[]');
    this.debug = Debug(`[View:${this.viewname}]`);

    viewMount.apply(this);
    
    this._handleBackground = setInterval(_.bind(this._backgroundWorker, this), 1000/30);
  },
  
  _plugins: {
    'text': PluginText,
    'input-text': PluginInputText,
    'checkbox': PluginCheckbox
  },

  delegateEvents(events) {
    events || (events = _.result(this, 'events'));

    if (!events) return this;

    this.undelegateEvents();

    for (let key in events) {
      let method = events[key];
      let match = key.match(delegateEventSplitter);
      let childMatch = key.match(childEventSplitter);
      let eventName;
      let selector;
      let listener;
      
      if (!!childMatch) {
        const index = method.indexOf('(');
        
        let params = [];
        
        eventName = childMatch[1];
        selector = childMatch[2];
        
        if (!!~index) {
          params = method.substring(index + 1, method.length - 1).split(',').map(el => $.trim(el));
          method = method.substring(0, index);
        }
        
        listener = _.bind(function(method, params, event, ...args) {
          const _this = this;
          const values = _.map(params, function(param) { return _this.$(param).val(); });
          
          return this[method].apply(this, _.concat(values, args, event));
        }, this, method, params);
      } else {
        if (!_.isFunction(method)) method = this[method];
        if (!method) continue;
      
        eventName = match[1];
        selector = match[2];
        listener = _.bind(method, this);
      }
      
      this.delegate(eventName, selector, listener);
    }

    return this;
  },

  _backgroundWorker() {
    this._bindChildEvents();
    
    if (!!this.r) this.r();
  },

  updateView(container, ChildView, ...args) {
    if (!arguments.length) {
      this.close(true);
      
      viewMount.apply(this);
      
      return;
    }
    
    if (this._views[container]) {
      this._views[container].update.apply(this._views[container], args);
    } else {
      ChildView.prototype.container = (typeof container === 'string') ? this.$(container) : container;
      
      let view = new (Function.prototype.bind.apply(ChildView, _.concat(ChildView, args)));
      
      this._views[container] = view;
    }
  },

  update(...args) {
    if (this.onUpdate) {
      this.onUpdate.apply(this, args);
    }
  },

  getStates() {
    return global.woowahan.getStates();
  },

  dispatch(action, subscriber, options) {
    action.__options = options || {};
    
    switch(action.wwtype) {
      case 'event':
        this.$el.trigger(action.type, ...action.data);
        break;
      case 'action':
        //TODO: 리펙토링
        global.woowahan.dispatch(action, _.bind(subscriber, this));
        break;
    }
  },

  setModel(attrs) {
    if (attrs instanceof Backbone.Model) {
      if (!!this.model) {
        this._unbindModel();
        this.model.remove();
      }
      
      this.model = attrs.clone();
      
      if (this._viewMounted) {
        this._bindModel();
      }
      return;
    }
    
    if (!this.model || !(this.model instanceof Backbone.Model)) {
      this.model = new Backbone.Model();
      
      if (this._viewMounted) {
        this._bindModel();
      }
    }

    for(let attr in attrs) {
      let value = this.model.get(attr);

      if (value !== attrs[attr]) {
        this.model.set(attr, attrs[attr]);
      }
    }
  },

  getModel(key) {
    if (!this.model || !(this.model instanceof Backbone.Model)) {
      this.model = new Backbone.Model();
    }
    
    if (!key) {
      return this.model.toJSON();
    }

    return this.model.get(key);
  },

  log() {
    this.debug(format.apply(this, arguments));
  },

  logStamp() {
    this.log(arguments);
  },

  close() {
    if (typeof this.viewWillUnmount === 'function') {
      this.viewWillUnmount();
    }
    
    this._clearBackgroundWorker();
    this._off();
    this._unbindModel();
    this._removeChild();
    this.remove();
  },

  _clearBackgroundWorker() {
    if (this._handleBackground) {
      clearInterval(this._handleBackground);
    }
  },

  _off() {
    for (let key in this._events) {
      if (this._events[key].on) {
        this._views[key].off(this._events[key].name, _.bind(this._events[key].listener, this));
        this._events[key].on = false;
      }
    }
  },

  _bindChildEvents() {
    for (let key in this._events) {
      if (this._views[key] && !this._events[key].on) {
        this._views[key].on(this._events[key].name, _.bind(this._events[key].listener, this));
        this._events[key].on = true;
      }
    }
  },

  _bindModel() {
    this._unbindModel();
    
    let targetElements = this.$el.find('[data-role=bind]');
    
    _.each(targetElements, _.bind(function(element) {
      let key = element.dataset.name;
      let eventName = `change:${key}`;
      this.listenTo(this.model, eventName, _.bind(function(element, key) {
        let value = this.model.get(key);
        let type = (element.dataset.type || DEFAULT_ATTR_TYPE).toLowerCase();
        this._plugins[type].call(this, element, value);
      }, this, element, key));
    }, this));
  },

  _unbindModel() {
    this.stopListening(this.model);
  },

  _removeChild() {
    for (var key in this._views) {
      this._views[key].close.call(this._views[key]);
      delete this._views[key];
    }
  }
});

View.create = (viewName, options) => {
  let view = View.extend(options);

  view.viewname = viewName;
  Object.defineProperty(view.prototype, 'viewname', {value: viewName, writable: false});

  return view;
};

module.exports = View;