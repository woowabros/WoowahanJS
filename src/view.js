const Debug = require('debug');
const format = require('util').format;
const Backbone = require('backbone');

const MIDDLEWARE = require('./middleware').MIDDLEWARE;
const MIDDLEWARE_PROTOCOL = require('./middleware').MIDDLEWARE_PROTOCOL;
const MiddlewareRunner = require('./middleware').MiddlewareRunner;

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
  let container = this.container;
  let template = this.template;
  let domStr;
  let $dom;

  if (!container) {
    throw new Error(`[${this.viewname}] Required attribute "container" is missing.`);
  } else {
    if (typeof container === 'string') {
      container = $(container);
    }
  }

  if (!container || !container.length) {
    throw new Error(`[${this.viewname}] "container" is undefined.`);
  }

  let renderData = this.getModel();

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
      } while ((proto = proto.__proto__) && (proto.viewname !== '___WOOWA_VIEW___'));
    }

    if (!!tagName || $(domStr).length > 1) {
      $dom = $(`<${tagName || 'div'}>${domStr}</${tagName || 'div'}>`);
    } else {
      $dom = $(domStr);
    }

    if (!!this.className) {
      $dom.addClass(this.className);
    }

    if (this._viewMounted) {
      if ($.contains(container[0], this.el)) {
        this.$el.replaceWith($dom);
      } else {
        container.html($dom);
      }
    } else {
      if (!!this.append) {
        container.append($dom);
      } else if (!!this.prepend) {
        container.prepend($dom);
      } else if (!!this.after) {
        container.after($dom);
      } else {
        container.html($dom);
      }
    }

    this.setElement($dom);
  } else {
    this.setElement(container);
  }

  this._viewMounted = true;
  this._bindRef();
  this._bindModel();

  if (typeof this.viewComponentDidMount === 'function') {
    this.viewComponentDidMount($dom);
  }

  let viewDidMount;

  if (typeof this.viewDidMount === 'function') {
    viewDidMount = this.viewDidMount.bind(this, $dom);
  }

  const middlewares = app.getMiddleware(MIDDLEWARE.VIEW, MIDDLEWARE_PROTOCOL.AFTER);

  MiddlewareRunner.run(middlewares, MIDDLEWARE_PROTOCOL.AFTER, [this], function() {
    ['viewDidMount', 'mount'].forEach(type => {
      this.dispatch(Woowahan.Event.create(type, this));
      this.trigger(type);
    });
  }.bind(this), viewDidMount);
};

View = Backbone.View.extend({
  super(...args) {
    View.prototype.initialize.apply(this, args);
  },

  initialize(model) {
    this._viewMounted = false;
    this._views = {};
    this.debug = Debug(`View:${this.viewname}`);
    this.container = this.container;

    if (!!model) {
      this.setModel(model);
    }

    const middlewares = app.getMiddleware(MIDDLEWARE.VIEW, MIDDLEWARE_PROTOCOL.BEFORE);

    MiddlewareRunner.run(middlewares, MIDDLEWARE_PROTOCOL.BEFORE, [this], function() {
      viewMount.apply(this);
    }.bind(this));
  },
  
  _plugins: {
    'text': PluginText,
    'input-text': PluginInputText,
    'checkbox': PluginCheckbox,
    'select': PluginSelect
  },

  delegateEvents(events) {
    events = events || this.events;

    if (!events) return this;

    this.undelegateEvents();

    for (let key in events) {
      if (events.hasOwnProperty(key)) {
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

          listener = function(eventName, selector, method, params, event, ...args) {
            const _this = this;

            const getVal = function($el) {
              if ($el.is('input[type=checkbox]') || $el.is('input[type=radio]')) {
                return $el.is(':checked');
              } else if ($el.is('select')) {
                return $el.val();
              } else {
                return $el.val() || $el.text();
              }
            };

            const values = params.map(param => getVal(_this.$(param)));

            if (eventName === 'submit') {
              const inputs = {};

              for (const el of _this.$(selector).find('input, select, textarea')) {
                inputs[$(el).attr('name')] = getVal($(el));
              }

              values.push(inputs);
            }

            if (Object.prototype.toString.call(method) !== '[object Function]') {
              method = this[method];
            }

            return method.apply(this, Array.prototype.concat.call(values, args, event));
          }.bind(this, eventName, selector, method, params);
        } else {
          if (Object.prototype.toString.call(method) !== '[object Function]') {
            method = this[method];
          }

          if (!method) continue;

          eventName = match[1];
          selector = match[2];

          listener = method.bind(this);
        }

        this.delegate(eventName, selector, listener);
      }
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

    if (typeof ChildView !== 'function') {
      args = ChildView;
    }

    let viewContainer = (typeof container === 'string') ? this.$(container) : container;

    if (!viewContainer.length) {
      viewContainer = $(container);
    }

    let view = this._views[container];

    if (!!view) {
      view.setModel.apply(view, Array.prototype.concat.call(args, { silent: true }));
      view.container = viewContainer;

      let middlewares = app.getMiddleware(MIDDLEWARE.VIEW, MIDDLEWARE_PROTOCOL.UNMOUNT);

      MiddlewareRunner.run(middlewares, MIDDLEWARE_PROTOCOL.UNMOUNT, [this], function() {
        if (typeof view.viewWillUnmount === 'function') {
          view.viewWillUnmount.call(view);
        }

        view.dispatch(Woowahan.Event.create('unmount', this));
        view.trigger('unmount');

        viewMount.apply(this._views[container]);
      }.bind(this));
    } else {
      ChildView.prototype.container = viewContainer;

      view = new (Function.prototype.bind.apply(ChildView, Array.prototype.concat.call(ChildView, args)));

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

  addPopup(view, options = {}, callback) { // TODO: options 추가
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    view = (typeof view === 'string') ? this.getComponent(view) : view;

    const name = view.viewname;

    let containerName;
    let container;
    let popup;

    if (!!view) {
      let _id = options._id || `${name}Container${Date.now()}`;

      if (!!$(`div[data-id=${_id}]`).length) {
        return;
      }

      containerName = _id;
      container = $(`<div data-id="${containerName}"></div>`);

      $('body').append(container);

      popup = this.addView(`div[data-id=${containerName}]`, view, Object.assign(options, { _id }));

      popup.on('remove', function() {
        popup.off('remove');

        $(`div[data-id=${containerName}]`).remove();
      });

      popup.closePopup = function(containerName, callback, data) {
        this.removeView(`div[data-id=${containerName}]`);

        if (!!callback) {
          callback.call(this, data);
        }
      }.bind(this, containerName, callback);

      return popup;
    } else {
      console.error(`undefined popup name [${name}]`);
    }
  },

  getStates(key) {
    return app.getStates(key);
  },

  setStates(key, value) {
    app.setStates(key, value);
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
    
    switch (action.wwtype) {
      case 'event':
        this.$el.trigger(action.type, ...action.data);
        break;
      case 'action':
        if (!!subscriber) {
          subscriber = subscriber.bind(this);
        }

        app.dispatch(action, subscriber);
        break;
    }
  },

  setModel(key, value) {
    let attrs;

    if (typeof key === 'string' && typeof value !== 'undefined') {
      attrs = { [key]: value };
    } else {
      attrs = key;
    }

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

    for (let attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        let value = this.model.get(attr);

        if (value !== attrs[attr]) {
          this.model.set(attr, attrs[attr]);
        }
      }
    }
  },

  getModel(key) {
    if (!this.model || !(this.model instanceof Backbone.Model)) {
      this.model = new Backbone.Model();
    }
    
    if (!key) {
      return this.model.clone().toJSON();
    }

    return this.model.clone().get(key);
  },

  log(...args) {
    this.debug(format.apply(this, args));
  },

  logStamp(...args) {
    this.log(args);
  },

  close(remove) {
    let middlewares = app.getMiddleware(MIDDLEWARE.VIEW, MIDDLEWARE_PROTOCOL.UNMOUNT);

    MiddlewareRunner.run(middlewares, MIDDLEWARE_PROTOCOL.UNMOUNT, [this], function() {
      if (typeof this.viewWillUnmount === 'function') {
        this.viewWillUnmount();
      }

      this.dispatch(Woowahan.Event.create('unmount', this));
      this.trigger('unmount');

      this._unbindModel();
      this._removeChild(remove);

      if (remove + '' !== 'false' && !!this) {
        this._unbindRef();
        this.remove();
      }
    }.bind(this));
  },

  remove(...args) {
    this.dispatch(Woowahan.Event.create('remove', this));
    this.trigger('remove');

    Backbone.View.prototype.remove.apply(this, args);
  },

  _syncElement(source, target) {
    let $source = $(source);
    let $target = $(target);

    if ($source.is('input[type=text]') || $source.is('input[type=number]') || $source.is('input[type=tel]') || $source.is('textarea')) {
      $target.val($source.val());
    } else if ($source.is('input[type=checkbox]') || $source.is('input[type=radio]')) {
      $target.prop('checked', $source.is(':checked'));
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
  },

  _bindModel() {
    this._unbindModel();

    let targetElements = this.$el.find('[data-role=bind]');
    let element;

    for (element of targetElements) {
      let key = $(element).data('name');
      let eventName = `change:${key}`;
      let type = ($(element).data('type') || DEFAULT_ATTR_TYPE).toLowerCase();
      let value = this.model.get(key);

      this.listenTo(this.model, eventName, function(element, key, type) {
        let value = this.model.get(key);

        this._plugins[type].call(this, element, value);
      }.bind(this, element, key, type));

      if (typeof value !== 'undefined') this._plugins[type].call(this, element, value);
    }

    targetElements = this.$el.find('[data-role=plugin]');

    for (element of targetElements) {
      let plugins = $(element).data('plugins');

      if (!plugins) throw new Error('plugin must have plugins');

      plugins.split('+').map(s => $.trim(s)).forEach(plugin => {
        let [keys, type] = plugin.split('=>').map(s => $.trim(s));

        keys = keys.split(',').map(k => $.trim(k));
        type = type.toLowerCase();
        
        keys.forEach(key => {
          if (key === '') return;

          let value = this.model.get(key);
          
          this.listenTo(this.model, `change:${key}`, function(element, key, type) {
            let value = this.model.get(key);

            this._plugins[type].call(this, element, value);
          }.bind(this, element, key, type));

          if (typeof value !== 'undefined') this._plugins[type].call(this, element, value);
        });
      });
    }
  },

  _unbindRef() {
    for (const ref in this.refs) {
      if (this.refs.hasOwnProperty(ref)) {
        this.refs[ref] = null;
      }
    }

    this.refs = null;
  },

  _unbindModel() {
    this.stopListening(this.model);
  },

  _removeChild(remove) {
    for (let key in this._views) {
      if (this._views.hasOwnProperty(key)) {
        this._views[key].close.call(this._views[key], remove);
        delete this._views[key];
      }
    }
  }
});

View.create = (viewName, options) => {
  let view = View.extend(options);

  view.viewname = viewName;
  Object.defineProperty(view.prototype, 'viewname', { value: viewName, writable: false });

  return view;
};

module.exports = function(toolset) {
  if (!app) {
    app = toolset;
  }
  
  return View;
};