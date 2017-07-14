const Woowahan = require('./woowahan');

let PopupView;
let app;
let zIndex = 1000;

const defaultOverlayCss = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: '#000',
  opacity: 0.7
};

const defaultCss = {
  overflowY: 'auto',
  display: 'block',
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '80%',
  maxHeight: '80%',
  background: '#fff',
  webkitTransform: 'translate(-50%, -50%)',
  transform: 'translate(-50%, -50%)'
};

PopupView = Woowahan.View.create('PopupView', {
  overlayClassName: '',
  overlayCss: {},
  css: {},
  showOverlay: true,
  useDefaultCss: true,

  super() {
    PopupView.prototype.initialize.apply(this, this.arguments);
  },

  initialize(...args) {
    this.overlay = $('<div></div>');

    Woowahan.View.prototype.initialize.apply(this, args);
  },

  viewComponentDidMount($el) {
    const model = this.getModel();

    Object.keys(model).map(function(key) {
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
          const buttons = model.buttons;

          if (!this.events) {
            this.events = {};
          }

          for (const button in buttons) {
            if (buttons.hasOwnProperty(button)) {
              this.events[`click ${button}`] = buttons[button].bind(this);
            }
          }

          this.delegateEvents();
          break;
      }
    }.bind(this));

    if (this.showOverlay) {
      const overlay = this.overlay;

      overlay.addClass(this.overlayClassName);
      overlay.css(Object.assign({ zIndex }, defaultOverlayCss, this.overlayCss));

      this.$el.parent().prepend(overlay);

      zIndex += 100;

      $(overlay).on('click', function() {
        this.dispatch(Woowahan.Event.create('overlayClicked', this));
      }.bind(this));
    }

    if (this.useDefaultCss) {
      $el.css(defaultCss);
    }

    $el.css(Object.assign({ zIndex }, this.css));

    zIndex += 100;
  }
});

PopupView.create = (viewName, options) => {
  let view = PopupView.extend(options);

  view.viewname = viewName;
  Object.defineProperty(view.prototype, 'viewname', { value: viewName, writable: false });

  return view;
};

module.exports = function(toolset) {
  if (!app) {
    app = toolset;
  }

  return PopupView;
};