/*global $ _*/

const Debug = require('debug');
const format = require('util').format;
const Backbone = require('backbone');

const PluginText = require('./plugin/text');
const PluginInputText = require('./plugin/input-text');
const PluginCheckbox = require('./plugin/checkbox');
const PluginSelect = require('./plugin/select');

const delegateEventSplitter = /^(\S+)\s*(.*)$/;
const childEventSplitter = /^\@(\w+)\s*(.*)$/;
const DEFAULT_ATTR_TYPE = 'text';

let View;
let viewMount;
let app;

viewMount = function() {
  let tagName = this.tagName;
  let renderData = this.getModel();
  let container = this.container;
  let template = this.template;
  let domStr;
  let $dom;

  if (!container) {
    throw 'Required attribute "container" is missing.';
  } else {
    if (typeof container === 'string') {
      container = $(container);
    }
  }

  if (!container || !container.length) {
    throw '"container" is undefined.';
  }
  
  if (typeof this.viewWillMount === 'function') {
    renderData = this.viewWillMount(renderData) || renderData;
  }

  if (!!template) {
    if (typeof template === 'string') {
      domStr = template;
    } else {
      domStr = template(renderData);
    }

    if (tagName === 'div') {
      let proto = this;

      tagName = '';

      do {
        if (proto.hasOwnProperty('tagName') && !!proto.tagName) {
          tagName = proto.tagName;
          break;
        }
      } while((proto = proto.__proto__) && (proto.viewname !== '___WOOWA_VIEW___'));
    }

    if (!!tagName || $(domStr).length > 1) {
      $dom = $(`<${tagName || 'div'}>${domStr}</${tagName || 'div'}>`);
    } else {
      $dom = $(domStr);
    }

    if (!!this.className) {
      $dom.addClass(this.className);
    }

    if (!!this._viewMounted) {
      if ($.contains(container[0], this.el)) {
        this.$el.replaceWith($dom);
      } else {
        container.html($dom);
      }
    } else {
      if (!!this.append) {
        container.append($dom);
      } else {
        container.html($dom);
      }
    }

    this.setElement($dom);
  } else {
    this.setElement(container);
  }
  
  this._viewMounted = true;
  this._bindModel();
  
  if (typeof this.viewDidMount === 'function') {
    this.viewDidMount($dom);
  }
  
  _.delay(_.bind(function(){
    this.trigger('viewDidMount');
  }, this), 1);
};

View = Backbone.View.extend({
  super() {
    View.prototype.initialize.apply(this, arguments);
  },

  initialize(model) {
    this._viewMounted = false;
    this._views = {};
    this.debug = Debug(`View:${this.viewname}`);

    if (!!model) {
      this.setModel(model);
    }

    viewMount.apply(this);
  },
  
  _plugins: {
    'text': PluginText,
    'input-text': PluginInputText,
    'checkbox': PluginCheckbox,
    'select': PluginSelect
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
        const index = _.indexOf(method, '(');
        
        let params = [];
        
        eventName = childMatch[1];
        selector = childMatch[2];
        
        if (!!~index) {
          params = method.substring(index + 1, method.length - 1).split(',').map(el => $.trim(el));
          method = method.substring(0, index);
        }
        
        listener = _.bind(function(eventName, selector, method, params, event, ...args) {
          const _this = this;
          const values = _.map(params, function(param) { return _this.$(param).val(); });

          if (eventName === 'submit') {
            const inputs = {};

            _.each(_this.$(selector).find('input, select'), function(el) {
              inputs[$(el).attr('name')] = $(el).val();
            });

            values.push(inputs);
          }

          if (!_.isFunction(method)) method = this[method];
          
          return method.apply(this, _.concat(values, args, event));
        }, this, eventName, selector, method, params);
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

  updateView(container, ChildView, ...args) {
    if (!arguments.length) {
      this.close(false);
      
      viewMount.apply(this);
      
      return;
    }

    if (!!container && !ChildView) {
      this._views[container].close();

      delete this._views[container];

      return;
    }

    if (typeof ChildView != 'function') {
      args = ChildView;
    }

    if (!!this._views[container]) {
      this._views[container].setModel.apply(this._views[container], _.concat(args, { silent: true }));
      this._views[container].container = (typeof container === 'string') ? this.$(container) : container;

      viewMount.apply(this._views[container]);
    } else {
      ChildView.prototype.container = (typeof container === 'string') ? this.$(container) : container;
      
      let view = new (Function.prototype.bind.apply(ChildView, _.concat(ChildView, args)));
      
      this._views[container] = view;
    }

    return this._views[container];
  },

  addView(container, ChildView, ...args) {
    return this.updateView(container, ChildView, ...args);
  },

  removeView(container) {
    this.updateView(container);
  },

  getStates() {
    return app.getStates();
  },

  getComponent(name) {
    return app.getComponent(name).extend({});
  },

  dispatch(action, subscriber, options) {
    action.__options = options || {};
    
    switch(action.wwtype) {
      case 'event':
        this.$el.trigger(action.type, ...action.data);
        break;
      case 'action':
        app.dispatch(action, _.bind(subscriber, this));
        break;
    }
  },

  setModel(attrs) {
    if (attrs instanceof Backbone.Model) {
      if (!!this.model) {
        this._unbindModel();
      }
      
      this.model = attrs.clone();
      
      if (this._viewMounted) {
        this._bindModel();
      }
      return;
    }
    
    if (_.isNull(attrs) || !this.model || !(this.model instanceof Backbone.Model)) {
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

  close(remove) {
    if (typeof this.viewWillUnmount === 'function') {
      this.viewWillUnmount();
    }
    
    this._unbindModel();
    this._removeChild();
    
    if (remove + '' != 'false' && !!this) {
      this.remove();
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

module.exports = function(toolset) {
  if (!app) {
    app = toolset;
  }
  
  return View;
};