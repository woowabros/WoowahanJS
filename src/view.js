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

let View = null;
let viewMount = null;
let app = null;

viewMount = function() {
  let tagName = this.tagName;
  let renderData = this.getModel();
  let container = this.container;
  let template = this.template;
  let domStr;
  let $dom;

  let dom;

  if (!container) {
    throw `[${this.viewname}] Required attribute "container" is missing.`;
  } else {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
  }

  if (!container) {
    throw `[${this.viewname}] "container" is undefined.`;
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
      dom = `<${tagName || 'div'}>${domStr}</${tagName || 'div'}>`

      // $dom = $(`<${tagName || 'div'}>${domStr}</${tagName || 'div'}>`);
    } else {
      dom = domStr;

      // $dom = $(domStr);
    }

    if (!!this.className) {
      if (dom.classList) {
        dom.classList.add(this.className);
      } else {
        dom.className += ' ' + this.className;
      }

      // $dom.addClass(this.className);
    }

    if (!!this._viewMounted) {
      if (container !== this.el && container.contains(this.el)) {
        this.el.outerHTML = dom;

        // this.$el.replaceWith($dom);
      } else {
        container.innerHTML = dom;

        // container.html($dom);
      }

      // if ($.contains(container[0], this.el)) {
      //   this.$el.replaceWith($dom);
      // } else {
      //   container.html($dom);
      // }
    } else {
      if (!!this.append) {
        container.appendChild(dom);

        // container.append($dom);
      } else if (!!this.after) {
        container.insertAdjacentHTML('afterend', dom);

        // container.after($dom);
      } else {
        container.innerHTML = dom;

        // container.html($dom);
      }
    }

    this.setElement(dom);
  } else {
    this.setElement(container);
  }
  
  this._viewMounted = true;
  this._bindRef();
  this._bindModel();
  
  if (typeof this.viewDidMount === 'function') {
    this.viewDidMount($(dom));
  }

  setTimeout(function() {
    this.dispatch(Woowahan.Event.create('viewDidMount', this));

    this.trigger('viewDidMount');
  }.bind(this), 1);

  // _.delay(_.bind(function(){
  //   this.trigger('viewDidMount');
  // }, this), 1);
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
    events = events || this.events;

    // events || (events = _.result(this, 'events'));

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

        // const index = _.indexOf(method, '(');
        
        let params = [];
        
        eventName = childMatch[1];
        selector = childMatch[2];
        
        if (!!~index) {
          params = method.substring(index + 1, method.length - 1).split(',').map(el => el.trim());
          method = method.substring(0, index);
        }
        
        listener = function(eventName, selector, method, params, event, ...args) {
          const _this = this;

          const getVal = function(el) {
            if (isMatch(el, 'input[type=checkbox]') || isMatch(el, 'input[type=radio]')) {
              return isMatch(el, ':checked');

              // return $el.is(':checked');
            } else if (isMatch(el, 'select')) {
              return el.value;

              // return $el.val();
            } else {
              return el.value || el.textContent

              // return $el.val() || $el.text();
            }
          };

          const values = params.map(param => getVal(_this.querySelector(param)));

          // const values = _.map(params, function(param) {
          //   const $el = _this.$(param);
          //
          //   return getVal($el);
          // });

          if (eventName === 'submit') {
            const inputs = {};

            for (const el of _this.querySelector(selector).querySelectorAll('input, select, textarea')) {
              inputs[el.getAttribute('name')] = getVal(el);
            }

            // _.each(_this.$(selector).find('input, select, textarea'), function(el) {
            //   inputs[$(el).attr('name')] = getVal($(el));
            // });

            values.push(inputs);
          }

          if (Object.prototype.toString.call(method) !== '[object Function]') {
            method = this[method];
          }

          // if (!_.isFunction(method)) method = this[method];

          return method.apply(this, Array.prototype.concat.call(values, args, event));

          // return method.apply(this, _.concat(values, args, event));
        }.bind(this, eventName, selector, method, params);
      } else {
        if (Object.prototype.toString.call(method) !== '[object Function]') {
          method = this[method];
        }

        if (!method) continue;

        // if (!_.isFunction(method)) method = this[method];
        // if (!method) continue;

        eventName = match[1];
        selector = match[2];

        listener = method.bind(this);

        // listener = _.bind(method, this);
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
      if (!!this._views[container]) {
        this._views[container].close();

        delete this._views[container];
      }

      return;
    }

    if (typeof ChildView != 'function') {
      args = ChildView;
    }

    let viewContainer = (typeof container === 'string') ? this.el.querySelector(container) : container;

    // if (!viewContainer.length) {
    //   viewContainer = $(container);
    // }

    let view = this._views[container];

    if (!!view) {
      view.setModel.apply(view, Array.prototype.concat.call(args, { silent: true }));

      // view.setModel.apply(view, _.concat(args, { silent: true }));
      view.container = viewContainer;

      if (typeof view.viewWillUnmount === 'function') {
        view.viewWillUnmount.call(view);
      }

      viewMount.apply(this._views[container]);
    } else {
      ChildView.prototype.container = viewContainer;

      view = new (Function.prototype.bind.apply(ChildView, Array.prototype.concat.call(ChildView, args)));

      // view = new (Function.prototype.bind.apply(ChildView, _.concat(ChildView, args)));
      
      this._views[container] = view;
    }

    return view;
  },

  addView(container, ChildView, ...args) {
    this.removeView(container);

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

  getRouteTables(routeName, params, query) {
    if (routeName === void 0) {
      return app.getRouteTables();
    }

    let path = app.getRouteTables()[routeName];

    if (!path) {
      console.error(`"${routeName}" not found`);
      return;
    }

    if (typeof params === 'string') {
      return `${path()}?${encodeURIComponent(params)}`;
    } else {
      if (typeof query === 'string') {
        return `${path(params)}?${encodeURIComponent(query)}`;
      } else {
        return path(params);
      }
    }
  },

  dispatch(action, subscriber, options) {
    action.__options = options || {};
    
    switch(action.wwtype) {
      case 'event':
        this.$el.trigger(action.type, ...action.data);
        break;
      case 'action':
        app.dispatch(action, subscriber.bind(this));

        // app.dispatch(action, _.bind(subscriber, this));
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

    if (Object.prototype.toString.call(attrs) === '[object Null]' || !this.model || !(this.model instanceof Backbone.Model)) {
      this.model = new Backbone.Model();

      if (this._viewMounted) {
        this._bindModel();
      }
    }

    // if (_.isNull(attrs) || !this.model || !(this.model instanceof Backbone.Model)) {
    //   this.model = new Backbone.Model();
    //
    //   if (this._viewMounted) {
    //     this._bindModel();
    //   }
    // }

    for(let attr in attrs) {
      let value = this.model.get(attr);

      if (value !== attrs[attr]) {
        this.model.set(attr, attrs[attr]);
      }
    }
  },

  getModel(key) {
    let data;

    if (!this.model || !(this.model instanceof Backbone.Model)) {
      this.model = new Backbone.Model();
    }
    
    if (!key) {
      return this.model.clone().toJSON();

      // return _.cloneDeep(this.model.toJSON());
    }

    return this.model.clone().get(key);

    // return _.cloneDeep(this.model.get(key));
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
      this._unbindRef();
      this.remove();
    }
  },

  _syncElement(source, target) {
    let $source = $(source);
    let $target = $(target);

    if ($source.is('input[type=text]') || $source.is('input[type=number]') || $source.is('textarea')) {
      $target.val($source.val());
    } else if ($source.is('input[type=checkbox]') || $source.is('input[type=radio]')) {
      return $el.is(':checked');
    } else if ($source.is('select')) {
      $target.val($source.val());
    }
  },

  _bindRef() {
    if (!this.refs) {
      this.refs = {};
    }

    for (const element of this.$el.find('[data-ref]')) {
      let $element = $(element);
      let refName = $element.data('ref');
      let refGroup = $element.data('refGroup') || false;
      let refFormRestore = $element.data('refFormRestore') || false;

      if (refGroup) {
        if (this.refs[refName]) {
          this.refs[refName].push(element);
        } else {
          this.refs[refName] = [element];
        }
      } else {
        let currentElement = this.refs[refName];

        this.refs[refName] = element;

        if (currentElement) {
          refFormRestore && this._syncElement(currentElement, this.refs[refName]);
          currentElement = null;
        }
      }
    }

    // _.each(this.$el.find('[data-ref]'), _.bind(function(element) {
    //   let $element = $(element);
    //   let refName = $element.data('ref');
    //   let refGroup = $element.data('refGroup') || false;
    //   let refFormRestore = $element.data('refFormRestore') || false;
    //
    //   if (refGroup) {
    //     if (this.refs[refName]) {
    //       this.refs[refName].push(element);
    //     } else {
    //       this.refs[refName] = [element];
    //     }
    //   } else {
    //     let currentElement = this.refs[refName];
    //
    //     this.refs[refName] = element;
    //
    //     if (currentElement) {
    //       refFormRestore && this._syncElement(currentElement, this.refs[refName]);
    //       currentElement = null;
    //     }
    //   }
    // }, this));
  },

  _bindModel() {
    this._unbindModel();
    
    let targetElements = this.$el.find('[data-role=bind]');

    for (const element of targetElements) {
      let key = $(element).data('name');
      let eventName = `change:${key}`;

      this.listenTo(this.model, eventName, function(element, key) {
        let value = this.model.get(key);
        let type = ($(element).data('type') || DEFAULT_ATTR_TYPE).toLowerCase();
        this._plugins[type].call(this, element, value);
      }.bind(this, element, key));
    }

    // _.each(targetElements, _.bind(function(element) {
    //   let key = $(element).data('name');
    //   let eventName = `change:${key}`;
    //   this.listenTo(this.model, eventName, _.bind(function(element, key) {
    //     let value = this.model.get(key);
    //     let type = ($(element).data('type') || DEFAULT_ATTR_TYPE).toLowerCase();
    //     this._plugins[type].call(this, element, value);
    //   }, this, element, key));
    // }, this));
  },

  _unbindRef() {
    for (const ref in this.refs) {
      this.refs[ref] = null;
    }

    // _.each(this.refs, ref => {
    //   ref = null;
    // });

    this.refs = null;
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