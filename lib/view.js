/*global $ _*/
import Debug from 'debug';
import { format } from 'util';
import Backbone from 'backbone';

const delegateEventSplitter = /^(\S+)\s*(.*)$/;
const childEventSplitter = /^(\@)\s*(.*)$/;
const DEFAULT_ATTR_TYPE = 'text';

Backbone.Model.prototype.hasEventListener = function(eventName) {
  if (!this.hasOwnProperty('_events')) return false;
  return this._events.hasOwnProperty(eventName);
};

var View = Backbone.View.extend({
  super() {
    View.prototype.initialize.apply(this, arguments);
  },

  initialize() {
    this._finishBind = false;
    this._views = {};
    this._attached = {};
    this._events = this._events || {};
    this.debug = this['namespace'] ? Debug(this['namespace']) : Debug('[]');

    this._handleBackground = setInterval(_.bind(this._backgroundWorker, this), 1000/30);
  },

  $find(selector, cb) {
    this._attached[selector] = cb;
  },

  delegateEvents(events) {
    events || (events = _.result(this, 'events'));

    if (!events) return this;

    this.undelegateEvents();

    for (let key in events) {
      let method = events[key];

      if (!_.isFunction(method)) method = this[method];
      if (!method) continue;

      let match = key.match(delegateEventSplitter);
      let childMatch = match[1].match(childEventSplitter);

      if (childMatch) {
        let component = match[2];

        this._views = this._views || {};
        this._events = this._events || {};

        this._events[component] = {
          name: childMatch[2],
          listener: method
        };
      } else {
        this.delegate(match[1], match[2], _.bind(method, this));
      }
    }

    return this;
  },

  _backgroundWorker() {
    this._attachChildViews();
    this._attachedActions();
    this._bindChildEvents();
    
    if (!!this.r) this.r();
  },

  updateView(container, View, ...args) {
    if (this._views[container]) {
      this._views[container].update.apply(this._views[container], args);
    } else {
      let view = new (Function.prototype.bind.apply(View, _.concat(View, args)));

      this._views[container] = view;
    }
  },

  update(...args) {
    if (this.onUpdate) {
      this.onUpdate.apply(this, args);
    }
  },

  dispatch(action, subscriber, options) {
    action.__options = options || {};

    //TODO: 리펙토링
    global.woowahan.dispatch(action, _.bind(subscriber, this));
  },

  setModel(attrs) {
    if (!this.model) this.model = new Backbone.Model();

    for(let attr in attrs) {
      let value = this.model.get(attr);

      if (value !== attrs[attr]) {
        this.model.set(attr, attrs[attr]);
      }
    }
  },

  logStamp() {
    this.debug(format.apply(this, arguments));
  },

  close() {
    this._clearBackgroundWorker();
    this._off();
    this._unbindModel();
    this._removeChild();

    if (this.onClose) {
      this.onClose();
    }

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

  _attachChildViews() {
    for (let key in this._views) {
      if (!this._views[key].attach) {
        let $container = this.$el.find(key);
        if ($container.length > 0) {
          $container.html(this._views[key].$el);
          this._views[key].attach = true;
        }
      }
    }
  },

  _plugins: null, //Plugins,

  _attachedActions() {
    for (let key in this._attached) {
      let $elements = $(key);
      if ($elements.length > 0) {
        this._attached[key].call(this, $elements);
        delete this._attached[key];
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
    if (this._finishBind) return;
    if (this.model && this.model instanceof Backbone.Model) {
      let targetElements = this.$el.find('[data-role=bind]:not([data-bind=on])');

      this._finishBind = !targetElements.length;

      _.each(targetElements, function(element) {
        let eventName = `change:${element.dataset.name}`;
        if (!this.model.hasEventListener(eventName)) {
          let handler = (function($el) {
            return function(model) {
              let value = model.changed[_.first(Object.keys(model.changed))];
              let type = ($el.dataset.type || DEFAULT_ATTR_TYPE).toLowerCase();
              
              this._plugins[type].call(this, $el, value);
            };
          })(element);
          this.model.on(eventName, handler, this);
          this.$el.find(`[data-role=bind][data-name=${element.dataset.name}]`).attr('data-bind', 'on');
        }
      }.bind(this));
    }
  },

  _unbindModel() {
    if (this.model && this.model instanceof Backbone.Model) {
      _.each(this.$el.find('[data-role=bind]'), function(element) {
        this.model.off(`change:${element.dataset.attr}`);
      }.bind(this));
    }
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

export default View;