const Backbone = require('backbone');
const Router = require('./router');
const MIDDLEWARE = require('./middleware').MIDDLEWARE;
const MIDDLEWARE_PROTOCOL = require('./middleware').MIDDLEWARE_PROTOCOL;
const MiddlewareRunner = require('./middleware').MiddlewareRunner;

const INTERVAL = 1000/60;

const toolset = {
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

let instance;

/* Enable backbone.js devtools for chrome */
if (global.__backboneAgent) {
  global.__backboneAgent.handleBackbone(Backbone);
}

Backbone.Model.prototype.idAttribute = '___ID_ATTR___';
Backbone.View.prototype.viewname = '___WOOWA_VIEW___';

class Woowahan {
  
  constructor(settings = {}) {
    this.reducers = settings.reducers || {};
    this.components = settings.components || {};
    this.middlewares = {
      app: {
        before: [],
        after: [],
      },
      router: {
        before: [],
        after: [],
      },
      reducer: {
        before: [],
        after: [],
      },
      view: {
        before: [],
        after: [],
        unmount: [],
      },
    };

    this.importViews = {};
    this.store = null;
    this.queue = [];
    this.pretasks = [];
    this.actionObject = {};
    this.queuemonitor = null;
    
    instance = this;
    
    this.enableQueue();
  }

  import(Package) {
    Object.keys(Package.reducers || {}).forEach(reducerName => this.use(Package.reducers[reducerName]));
    
    Object.keys(Package.views || {}).forEach(viewname => this.importViews[viewname] = Package.views[viewname]);    
  }

  getView(viewname) {
    return this.importViews[viewname];
  }

  enableQueue() {
    this.queuemonitor = setInterval(this.queuing.bind(this), INTERVAL);
  }

  disableQueue() {
    this.queuemonitor = clearInterval(this.queuemonitor);
  }

  addAction(id) {
    this.actionObject[id] = Date.now();

    if (this.numberOfWorkAction() === 1) {
      this.trigger('start');
    }
  }

  removeAction(id) {
    delete this.actionObject[id];

    if (this.numberOfWorkAction() === 0) {
      this.trigger('finish');
    }
  }

  addError(err) {
    this.trigger('error', err);
  }

  queuing() {
    this.disableQueue();

    let item = this.queue.shift();

    if (!!item) {
      let reducer = this.reducers[item.action.type];

      if (!reducer) {
        this.enableQueue();
        throw new Error('The unregistered reducer. Please check the type of action, if there is a written reducer use after registration.');
      }

      // 리스너가 없는 경우 허용
      item.subscriber = item.subscriber || function() {};

      if (typeof item.subscriber !== 'function') {
        this.enableQueue();
        throw new Error('The listener must be a function. If you do not need the listener it may not be specified.');
      }

      if (reducer.schema) {
        let errors = reducer.schema.validate(item.action.data);

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

  bindStore(store) {
    this.store = store;
  }

  bindReducer(reducer) {
    this.reducers[reducer.actionName] = reducer;
  }

  bindComponent(component) {
    this.components[component.name] = component;
  }

  bindPlugin(plugin) {
    const type = plugin.type.toLowerCase();

    if (Woowahan.View.prototype._plugins.hasOwnProperty(type)) {
      throw new Error('Duplicate plugin name');
    }

    Woowahan.View.prototype._plugins[type] = plugin.plugin;
  }

  combineReducer(reducers) {
    if (!reducers) return;

    reducers.forEach(reducer => {
      this.bindReducer(reducer);
    });
  }

  getStates(key) {
    return (typeof key !== 'undefined') ? this.store[key] : this.store;
  }

  setStates(key, value) {
    let store;

    if (typeof key === 'string' && typeof value !== 'undefined') {
      store = { [key]: value };
    } else {
      store = key;
    }

    if (!this.store) {
      this.store = {};
    }

    Object.assign(this.store, store);
  }

  getMiddleware(type, delegate) {
    return this.middlewares[type][delegate];
  }

  getComponent(name) {
    const component = this.components[name];

    if (!!component) {
      return component.view;
    }
  }

  getRouteTables() {
    return Router.routeTables;
  }

  dispatch(action, subscriber) {
    this.queue.push({ action, subscriber });
  }
  
  use(module) {
    if (Array.isArray(module)) {
      module.forEach(m => this.useModule(m));
    } else {
      if (typeof module === 'object' && !('wwtype' in module)) {
        Object.keys(module).forEach(key => {
          if (typeof module[key] === 'function')
            this.useModule(module[key]);
        });
      } else { // function
        this.useModule(module);
      }
    }
  }

  useModule(module) {
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

  set(middleware, options = {}) {
    let instance = new middleware(options);

    if (instance.mwtype) {
      Object.values(MIDDLEWARE_PROTOCOL).forEach(delegate => {
        delegate in instance && this.middlewares[instance.mwtype][delegate].push(instance);
      });
    } else {
      throw new Error('Required attribute "mwtype" is missing.');
    }
  }

  start(design, options = {}) {
    if (typeof jQuery === 'undefined') {
      throw new Error('jQuery is not loaded!!');
    }

    let wait = setInterval(() => {
      switch (document.readyState) {
        case 'complete': case 'loaded': break;
        default: return;
      }

      clearInterval(wait);

      if (Backbone.History.started) {
        Backbone.history.stop();
      }

      if (!!design) {
        Router.design(design, options, toolset);
      }

      let middlewares = this.getMiddleware(MIDDLEWARE.APP, MIDDLEWARE_PROTOCOL.BEFORE);

      MiddlewareRunner.run(middlewares, MIDDLEWARE_PROTOCOL.BEFORE, [toolset], function() {
        middlewares = this.getMiddleware(MIDDLEWARE.APP, MIDDLEWARE_PROTOCOL.AFTER);

        MiddlewareRunner.run(middlewares, MIDDLEWARE_PROTOCOL.AFTER, [toolset], function() {
          Backbone.history.start({ pushState: !!options.pushState });
        });
      }.bind(this));
    }, 1);
  }

  numberOfAction() {
    return this.queue.length;
  }

  numberOfWorkAction() {
    return Object.keys(this.actionObject).length;
  }
}

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

Woowahan.version = '1.1.0';