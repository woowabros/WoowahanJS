'use strict';

var Backbone = require('backbone');
var Woowahan = require('./woowahan');
var events = require('./events');

var PopupView = void 0;
var app = void 0;

var defaultCss = {
  overflowY: 'auto',
  display: 'block',
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '80%',
  maxHeight: '80%',
  background: '#fff',
  webkitTransform: 'translate(-50%, -50%)',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000
};

var defaultOverlayCss = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: '#000',
  opacity: 0.7
};

PopupView = Woowahan.View.create('PopupView', {
  overlayCss: {},
  css: {},
  showOverlay: true,

  super: function _super() {
    PopupView.prototype.initialize.apply(this.arguments);
  },
  initialize: function initialize(options) {
    this.listenTo(this, 'viewDidMount', this.PopupDidMount.bind(this));

    Woowahan.View.prototype.initialize.apply(this, arguments);
  },
  PopupDidMount: function PopupDidMount() {
    this.$el.css(Object.assign({}, defaultCss, this.css));

    if (this.showOverlay) {
      var overlay = $('<div></div>');

      overlay.css(Object.assign({}, defaultOverlayCss, this.overlayCss));

      this.$el.parent().prepend(overlay);

      $(overlay).on('click', function () {
        this.dispatch(Woowahan.Event.create('overlayClicked', this));
      }.bind(this));
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