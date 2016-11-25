'use strict';

var Woowahan = require('./woowahan');

var PopupView = void 0;
var app = void 0;

var defaultOverlayCss = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: '#000',
  opacity: 0.7,
  zIndex: 1000
};

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
  zIndex: 1100
};

PopupView = Woowahan.View.create('PopupView', {
  overlayClassName: '',
  overlayCss: {},
  css: {},
  showOverlay: true,

  super: function _super() {
    PopupView.prototype.initialize.apply(this.arguments);
  },
  initialize: function initialize(options) {
    this.overlay = $('<div></div>');

    Woowahan.View.prototype.initialize.apply(this, arguments);
  },
  viewComponentDidMount: function viewComponentDidMount($el) {
    $el.css(Object.assign({}, defaultCss, this.css));

    if (this.showOverlay) {
      var overlay = this.overlay;

      overlay.addClass(this.overlayClassName);
      overlay.css(Object.assign({}, defaultOverlayCss, this.overlayCss));

      this.$el.parent().prepend(overlay);

      defaultOverlayCss.zIndex += 500;
      defaultCss.zIndex += 500;

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