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
  useDefaultCss: true,

  super: function _super() {
    PopupView.prototype.initialize.apply(this, this.arguments);
  },
  initialize: function initialize(options) {
    this.overlay = $('<div></div>');

    Woowahan.View.prototype.initialize.apply(this, arguments);
  },
  viewComponentDidMount: function viewComponentDidMount($el) {
    var model = this.getModel();

    Object.keys(model).map(function (key) {
      switch (key) {
        case 'css':
        case 'overlayCss':
          this[key] = Object.assign({}, this[key], model[key]);
          break;
        case 'overlayClassName':
        case 'showOverlay':
        case 'useDefaultCss':
          this[key] = model[key];
          break;
        case 'buttons':
          var buttons = model.buttons;

          if (!this.events) {
            this.events = {};
          }

          for (var button in buttons) {
            this.events['click ' + button] = buttons[button].bind(this);
          }

          this.delegateEvents();
          break;
      }
    }.bind(this));

    if (this.useDefaultCss) {
      $el.css(defaultCss);
    }

    $el.css(this.css);

    if (this.showOverlay) {
      var overlay = this.overlay;

      overlay.addClass(this.overlayClassName);
      overlay.css(Object.assign({}, defaultOverlayCss, this.overlayCss));

      this.$el.parent().prepend(overlay);

      $(overlay).on('click', function (event) {
        this.dispatch(Woowahan.Event.create('overlayClicked', this));

        // if (typeof this.onOverlayClick === 'function') {
        //   this.onOverlayClick(event);
        // } else {
        //   this.closePopup();
        // }
      }.bind(this));
    }

    defaultOverlayCss.zIndex += 500;
    defaultCss.zIndex += 500;
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