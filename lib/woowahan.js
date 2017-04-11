'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');
var format = require('util').format;
var Debug = require('debug');
var Backbone = require('backbone');
var Router = require('./router');

var debug = Debug('Woowahan');
var DELEGATE = ['before', 'after'];
var INTERVAL = 1000 / 60;

/*
 case VIEW_AFTER_MOUNT:
 return function(view) {

 };
 break;
 case VIEW_BEFORE_MOUNT:
 return function(view, next) {

 };
 break;
 case REDUCER_AFTER_REQUEST:
 return function(res, type, xhr) {

 };
 break;
 case REDUCER_BEFORE_REQUEST:
 return function(settings) {

 };
 break;

 */
function inspectMiddlewareType(middleware) {}

var toolset = {
  get dispatch() {
    return instance.dispatch.bind(instance);
  },

  get getMiddleware() {
    return instance.getMiddleware.bind(instance);
  },

  get getStates() {
    return instance.getStates.bind(instance);
  },

  get setStates() {
    return instance.setStates.bind(instance);
  },

  get getComponent() {
    return instance.getComponent.bind(instance);
  },

  get getRouteTables() {
    return instance.getRouteTables.bind(instance);
  },

  get addAction() {
    return instance.addAction.bind(instance);
  },

  get removeAction() {
    return instance.removeAction.bind(instance);
  },

  get addError() {
    return instance.addError.bind(instance);
  }
};

var instance = void 0;

/* Enable backbone.js devtools for chrome */
if (global.__backboneAgent) {
  global.__backboneAgent.handleBackbone(Backbone);
}

global._ = _;

Backbone.Model.prototype.idAttribute = '___ID_ATTR___';
Backbone.View.prototype.viewname = '___WOOWA_VIEW___';

var Woowahan = function () {
  function Woowahan() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Woowahan);

    this.reducers = settings.reducers || {};
    this.components = settings.components || {};
    this.middlewares = {
      app: {
        before: [],
        after: []
      },
      router: {
        before: [],
        after: []
      },
      reducer: {
        before: [],
        after: []
      },
      view: {
        before: [],
        after: []
      }
    };

    this.store = null;
    this.queue = [];
    this.actionObject = {};
    this.queuemonitor = null;

    instance = this;

    this.enableQueue();
  }

  _createClass(Woowahan, [{
    key: 'enableQueue',
    value: function enableQueue() {
      this.queuemonitor = setInterval(this.queuing.bind(this), INTERVAL);
    }
  }, {
    key: 'disableQueue',
    value: function disableQueue() {
      this.queuemonitor = clearInterval(this.queuemonitor);
    }
  }, {
    key: 'addAction',
    value: function addAction(id) {
      this.actionObject[id] = Date.now();

      if (this.numberOfWorkAction() === 1) {
        this.trigger('start');
      }
    }
  }, {
    key: 'removeAction',
    value: function removeAction(id) {
      delete this.actionObject[id];

      if (this.numberOfWorkAction() === 0) {
        this.trigger('finish');
      }
    }
  }, {
    key: 'addError',
    value: function addError(err) {
      this.trigger('error', err);
    }
  }, {
    key: 'queuing',
    value: function queuing() {
      this.disableQueue();

      var item = this.queue.shift();

      if (!!item) {
        var reducer = this.reducers[item.action.type];

        if (!reducer) {
          this.enableQueue();
          throw new Error('The unregistered reducer. Please check the type of action, if there is a written reducer use after registration.');
        }

        // 리스너가 없는 경우 허용
        item.subscriber = item.subscriber || function () {};

        if (typeof item.subscriber !== 'function') {
          this.enableQueue();
          throw new Error('The listener must be a function. If you do not need the listener it may not be specified.');
        }

        if (reducer.schema) {
          var errors = reducer.schema.validate(item.action.data);

          if (errors) {
            this.trigger('error', errors);
          } else {
            new (Function.prototype.bind.apply(reducer, Array.prototype.concat.call(reducer, item.action.data, item.subscriber.bind(this))))();
          }
        } else {
          new (Function.prototype.bind.apply(reducer, Array.prototype.concat.call(reducer, item.action.data, item.subscriber.bind(this))))();
        }
      }

      this.enableQueue();
    }
  }, {
    key: 'bindStore',
    value: function bindStore(store) {
      this.store = store;
    }
  }, {
    key: 'bindReducer',
    value: function bindReducer(reducer) {
      this.reducers[reducer.actionName] = reducer;
    }
  }, {
    key: 'bindComponent',
    value: function bindComponent(component) {
      this.components[component.name] = component;
    }
  }, {
    key: 'bindPlugin',
    value: function bindPlugin(plugin) {
      var type = plugin.type.toLowerCase();

      if (Woowahan.View.prototype._plugins.hasOwnProperty(type)) {
        throw 'Duplicate plugin name';
      }

      Woowahan.View.prototype._plugins[type] = plugin.plugin;
    }
  }, {
    key: 'combineReducer',
    value: function combineReducer(reducers) {
      var _this = this;

      if (!reducers) return;

      reducers.forEach(function (reducer) {
        _this.bindReducer(reducer);
      });
    }
  }, {
    key: 'getStates',
    value: function getStates(key) {
      return typeof key !== 'undefined' ? this.store[key] : this.store;
    }
  }, {
    key: 'setStates',
    value: function setStates(key, value) {
      var store = void 0;

      if (typeof key === 'string' && typeof value !== 'undefined') {
        store = _defineProperty({}, key, value);
      } else {
        store = key;
      }

      if (!this.store) {
        this.store = {};
      }

      Object.assign(this.store, store);
    }
  }, {
    key: 'getMiddleware',
    value: function getMiddleware(type, delegate) {
      return this.middlewares[type][delegate];
    }
  }, {
    key: 'getComponent',
    value: function getComponent(name) {
      var component = this.components[name];

      if (!!component) {
        return component.view;
      }
    }
  }, {
    key: 'getRouteTables',
    value: function getRouteTables() {
      return Router.routeTables;
    }
  }, {
    key: 'dispatch',
    value: function dispatch(action, subscriber) {
      debug(format('dispatch action %s', action.type));
      this.queue.push({ action: action, subscriber: subscriber });
    }
  }, {
    key: 'use',
    value: function use(module) {
      var _this2 = this;

      if (Array.isArray(module)) {
        module.forEach(function (m) {
          return _this2.useModule(m);
        });
      } else {
        if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && !('wwtype' in module)) {
          Object.keys(module).forEach(function (key) {
            if (typeof module[key] === 'function') _this2.useModule(module[key]);
          });
        } else {
          // function
          this.useModule(module);
        }
      }
    }
  }, {
    key: 'useModule',
    value: function useModule(module) {
      switch (module.wwtype) {
        case 'reducer':
          this.bindReducer(module);
          break;
        case 'layout':
          Router.bindLayout(module);
          break;
        case 'store':
          this.bindStore(module.store);
          break;
        case 'component':
          console.warn('Component:: Deprecated and will be removed in a future release.');
          this.bindComponent(module);
          break;
        case 'plugin':
          this.bindPlugin(module);
          break;
      }
    }
  }, {
    key: 'set',
    value: function set(middleware) {
      var _this3 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var instance = new middleware(options);

      if (instance.mwtype) {
        DELEGATE.forEach(function (delegate) {
          delegate in instance && _this3.middlewares[instance.mwtype][delegate].push(instance);
        });
      } else {
        // 경고
      }
    }
  }, {
    key: 'start',
    value: function start(design) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof jQuery === 'undefined') {
        throw new Error('jQuery is not loaded!!');
      }

      var wait = setInterval(function () {
        switch (document.readyState) {
          case 'complete':case 'loaded':
            break;
          default:
            return;
        }

        clearInterval(wait);

        if (!!design) {
          Router.design(design, options);
        }

        Backbone.history.start({
          pushState: !!options.pushState
        });
      }, 1);
    }
  }, {
    key: 'numberOfAction',
    value: function numberOfAction() {
      return this.queue.length;
    }
  }, {
    key: 'numberOfWorkAction',
    value: function numberOfWorkAction() {
      return Object.keys(this.actionObject).length;
    }
  }]);

  return Woowahan;
}();

Object.assign(Woowahan.prototype, Backbone.Events);

Woowahan.$ = Backbone.$;

Woowahan.View = require('./view')(toolset);
Woowahan.Reducer = require('./reducer')(toolset);
Woowahan.Error = require('./error');
Woowahan.Types = require('./types');
Woowahan.Store = require('./store');
Woowahan.Action = require('./action');
Woowahan.Event = require('./event');
Woowahan.Schema = require('./schema');
Woowahan.Layout = require('./layout');
Woowahan.Component = require('./component');
Woowahan.Plugin = require('./plugin');

module.exports = global.Woowahan = Woowahan;

/** components */
Woowahan.CollectionView = require('./collection-view')(toolset);
Woowahan.ItemView = require('./item-view')(toolset);
Woowahan.PopupView = require('./popup-view')(toolset);