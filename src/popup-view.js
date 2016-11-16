const Backbone = require('backbone');
const Woowahan = require('./woowahan');
const events = require('./events');

let PopupView;
let app;

PopupView = Woowahan.View.create('PopupView', {
  super() {
    PopupView.prototype.initialize.apply(this.arguments);
  },

  initialize() {

    Woowahan.View.prototype.initialize.apply(this, arguments);
  },

  closePopup() {

  }
});

PopupView.create = (viewName, options) => {
  let view = PopupView.extend(options);

  view.viewname = viewName;
  Object.defineProperty(view.prototype, 'viewname', {value: viewName, writable: false});

  return view;
};

module.exports = function(toolset) {
  if (!app) {
    app = toolset;
  }

  return PopupView;
};