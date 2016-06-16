import Debug from 'debug';
import { format } from 'util';
import Backbone from 'backbone';

const INTERVAL = 1000/30;

var CoreRouter = Backbone.Router.extend({
  views: [],

  super() {
    CoreRouter.prototype.initialize.apply(this, arguments);
  },

  initialize() {
    if (typeof this['namespace'] !== 'undefined') {
      this.debug = Debug(this['namespace']);
    }

    this._handleBackground = setInterval(_.bind(this._backgroundWorker, this), INTERVAL);

    Backbone.history.start();
  },

  _backgroundWorker() {
    if (this.$container && this.$container.length > 0) return;

    this.$container = $(this.container);

    this.views.forEach(view => {
      this.$container.html(view.$el)
    })


  },

  addView(view) {
    $(this.container).html(view.$el);
    this.views.push(view);
  },

  clearView() {
    this.views.forEach(view => view.close());
  },

  execute(cb, args) {
    if (typeof this['before'] === 'function') {
      this['before'].call(this, cb && cb.name);
    }

    if (typeof cb === 'function') cb.apply(this, args);

    if (typeof this['after'] === 'function') {
      this['after'].call(this, cb && cb.name);
    }
  },

  logStamp() {
    this.debug(format.apply(this, arguments));
  }
});

export default CoreRouter;