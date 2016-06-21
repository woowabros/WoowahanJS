import _ from 'lodash';
import $ from 'jquery';
import Handlebars from 'handlebars/runtime';
import { format } from 'util';
import Debug from 'debug';
import Backbone from 'backbone';
import Types from './types';
import View from './view';
import CollectionView from './collection-view';
import ItemView from './item-view';
import Action from './action';
import Layout from './layout';
import Reducer from './reducer';
import Router from './router';

const debug = Debug('Woowahan');
const INTERVAL = 1000/60;

global._ = _;
global.$ = window.jQuery = $;
global.Handlebars = Handlebars;

/* Enable backbone.js devtools for chrome */
if (global.__backboneAgent) {
  global.__backboneAgent.handleBackbone(Backbone);
}

// const pValue = {};
//
// pValue[this.wid]

export default class Woowahan {
  constructor(settings = {}) {
    this.reducers = settings.reducers || {};
    this.routers = settings.routers || {};

    this.queue = [];
    this.actionObject = {};
    this.queuemonitor = null;
    
    this.router = null;

    // TODO: EventDispatcher를 분리하여 만들고 Woowa를 싱글톤으로 처리하여 제어하도록 개선
    global.woowahan = this;
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

    const item = this.queue.shift();

    if (!!item) {
      const Reducer = this.reducers[item.action.type];

      if(!Reducer) {
        this.enableQueue();
        throw new Error('The unregistered reducer. Please check the type of action, if there is a written reducer use after registration.');
      }

      new (Function.prototype.bind.apply(Reducer, _.concat(Reducer, item.action.data, _.bind(item.subscriber, this))))();
    }

    this.enableQueue();
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

  dispatch(action, subscriber) {
    debug(format('dispatch action %s', action.type));
    this.queue.push({ action, subscriber });
  }
  
  use(module) {
    switch (module.wwtype) {
      case 'reducer':
        this.bindReducer(module);
        break;
      case 'layout':
        console.log(module);
        Router.bindLayout(module);
        break;
    }
  }

  start(config) {
    let wait = setTimeout(_ => {
      switch (document.readyState) {
        case 'complete': case 'loaded': break;
        default: return;
      }

      clearTimeout(wait);

      debug('start');

      this.enableQueue();

      if (!!config) {
        if (!!config.layout) {
          Router.setLayout(config.layout);
        }
        
        Router.design(config.design, config.options);
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

Woowahan.createError = error => ({ type: 'error', error });
Woowahan.dispatchEvent = event => global.woowahan.dispatchEvent(event);

Woowahan.Action = Action;
Woowahan.Layout = Layout;
Woowahan.Reducer = Reducer;
Woowahan.View = View;
Woowahan.CollectionView = CollectionView;
Woowahan.ItemView = ItemView;