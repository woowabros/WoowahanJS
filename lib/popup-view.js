'use strict';

var Backbone = require('backbone');
var Woowahan = require('./woowahan');
var events = require('./events');

var PopupView = void 0;
var app = void 0;

var defaultCss = {
  overflowY: 'scroll',
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '80%',
  maxHeight: '80%',
  background: '#fff',
  zIndex: 1000,

  // on
  webkitAnimation: 'modal 0.3s ease',
  animation: 'modal 0.3s ease',
  webkitAnimationFillMode: 'forwards',
  animationFillMode: 'forwards'
};

var defaultOverlayCss = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: '#000',
  opacity: 0.7,
  webkitTransition: 'opacity 0.3s ease',
  transition: 'opacity 0.3s ease'
};

PopupView = Woowahan.View.create('PopupView', {
  overlayCss: {},
  css: {},
  showOverlay: true,
  baseZ: 1000,

  super: function _super() {
    PopupView.prototype.initialize.apply(this.arguments);
  },
  initialize: function initialize(options) {
    this.listenTo(this, 'viewDidMount', this.PopupDidMount.bind(this));

    if (Object.prototype.toString.call(options) === '[object Object]') {
      Object.keys(options).map(function (key) {
        this[key] = options[key];
      }.bind(this));
    }

    Woowahan.View.prototype.initialize.apply(this, arguments);
  },
  PopupDidMount: function PopupDidMount() {
    this.$el.css(Object.assign({}, this.css, defaultCss));

    if (this.showOverlay) {
      var overlay = $('<div></div>');

      overlay.css(Object.assign({}, this.overlayCss, defaultOverlayCss));

      this.$el.parent().prepend(overlay);
    }
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