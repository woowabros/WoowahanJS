const _ = require('lodash');
const $ = require('jquery');
const format = require('util').format;
const Debug = require('debug');
const Backbone = require('backbone');
const Router = require('./router');

const debug = Debug('Woowahan');
const INTERVAL = 1000/60;

const toolset = {
  get dispatch() {
    return _.bind(instance.dispatch, instance);
  },
  get getStates() {
    return _.bind(instance.getStates, instance);
  },
  get addAction() {
    return _.bind(instance.addAction, instance);
  },
  get removeAction() {
    return _.bind(instance.removeAction, instance);
  },
  get addError() {
    return _.bind(instance.addError, instance);
  }
};

let instance;

global._ = _;
global.$ = global.jQuery = $;

/* Enable backbone.js devtools for chrome */
if (global.__backboneAgent) {
  global.__backboneAgent.handleBackbone(Backbone);
}

class Woowahan {
  constructor(settings = {}) {
    this.reducers = settings.reducers || {};
    this.store = null;
    this.queue = [];
    this.actionObject = {};
    this.queuemonitor = null;
    
    instance = this;
    
    this.enableQueue();
  }

  enableQueue() {
    this.queuemonitor = setInterval(_.bind(this.queuing, this), INTERVAL);
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

    if(!!item) {
      var reducer = this.reducers[item.action.type];

      if(!reducer) {
        this.enableQueue();
        throw new Error('The unregistered reducer. Please check the type of action, if there is a written reducer use after registration.');
      }

      // 리스너가 없는 경우 허용
      item.subscriber = item.subscriber || function () {};

      if(typeof item.subscriber !== 'function') {
        this.enableQueue();
        throw new Error('The listener must be a function. If you do not need the listener it may not be specified.');
      }

      if (reducer.schema) {
        let errors = reducer.schema.validate(item.action.data);

        if (errors) {
          this.trigger('error', errors);
        } else {
          new (Function.prototype.bind.apply(reducer, _.concat(reducer, item.action.data, _.bind(item.subscriber, this))))();
        }
      } else {
        new (Function.prototype.bind.apply(reducer, _.concat(reducer, item.action.data, _.bind(item.subscriber, this))))();
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

  combineReducer(reducers) {
    if (!reducers) return;

    reducers.forEach(reducer => {
      this.bindReducer(reducer);
    });
  }

  getStates() {
    return this.store;
  }

  dispatch(action, subscriber) {
    debug(format('dispatch action %s', action.type));
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
    }
  }

  start(design, options) {
    let wait = setTimeout(_ => {
      switch (document.readyState) {
        case 'complete': case 'loaded': break;
        default: return;
      }

      clearTimeout(wait);

      if (!!design) {
        Router.design(design, options);
      }

      Backbone.history.start();
    }, 1);
  }

  numberOfAction() {
    return this.queue.length;
  }

  numberOfWorkAction() {
    return Object.keys(this.actionObject).length;
  }
}

_.extend(Woowahan.prototype, Backbone.Events);

Woowahan.View           = require('./view')(toolset);
Woowahan.Reducer        = require('./reducer')(toolset);
Woowahan.Error          = require('./error');
Woowahan.Types          = require('./types');
Woowahan.Store          = require('./store');
Woowahan.Action         = require('./action');
Woowahan.Event          = require('./event');
Woowahan.Schema         = require('./schema');
Woowahan.Layout         = require('./layout');

module.exports = global.Woowahan = Woowahan;

/** components */
Woowahan.CollectionView = require('./collection-view')(toolset);
Woowahan.ItemView       = require('./item-view')(toolset);