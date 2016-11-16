'use strict';

var Backbone = require('backbone');
var Woowahan = require('./woowahan');
var events = require('./events');

var PopupView = void 0;
var app = void 0;

PopupView = Woowahan.View.create('PopupView', {
  super: function _super() {
    PopupView.prototype.initialize.apply(this.arguments);
  },
  initialize: function initialize() {
    this.on('viewDidMount', this.PopupDidMount.bind(this));

    Woowahan.View.prototype.initialize.apply(this, arguments);
  },
  PopupDidMount: function PopupDidMount() {
    this.$el.addClass('modal-box').addClass('on').parent().prepend('<div class="modal-overlay on"></div>');
  }
});

PopupView.create = function (viewName, options) {
  var view = PopupView.extend(options);

  view.viewname = viewName;
  Object.defineProperty(view.prototype, 'viewname', { value: viewName, writable: false });

  return view;
};

module.exports = function (toolset) {
  if (!app) {
    app = toolset;
  }

  return PopupView;
};