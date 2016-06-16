import _ from 'lodash';
import $ from 'jquery';
import Handlebars from 'handlebars/runtime';
import { format } from 'util';
import Debug from 'debug';
import Backbone from 'backbone';
import View from './view';
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

const create = _ => {

};

class Woowahan {
  constructor(settings) {
    this.reducers = settings.reducers;
    this.routers = settings.routers;

    this.queue = [];
    this.actionObject = {};
    this.queuemonitor = null;

    // TODO: EventDispatcher를 분리하여 만들고 Woowa를 싱글톤으로 처리하여 제어하도록 개선
    global.woowa = this;
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
  
  use() {
    
  }

  start() {
    this.enableQueue();
    this.combineReducer(this.reducers);

    _.each(this.routers, Router => new Router);
  }

  numberOfAction() {
    return queue.length;
  }

  numberOfWorkAction() {
    return Object.keys(this.actionObject).length;
  }
}

Woowahan.View = View;
Woowahan.Router = Router;

_.extend(Woowahan.prototype, Backbone.Events);

_.each(['View', 'Router'], key => Woowahan[key] = { create: options => View.extend(options) });

// Woowa.action = {(type, data = {}) => { type, data };

export default Woowahan;