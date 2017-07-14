const Woowahan = require('./woowahan');
const events = require('./events');

let ItemView;
let app;

ItemView = Woowahan.View.create('ItemView', {

  events: {
    'click': '_onSelectedRow'
  },

  super(...args) {
    ItemView.prototype.initialize.apply(this, args);
  },

  initialize(...args) {
    Woowahan.View.prototype.initialize.apply(this, args);
  },

  _onSelectedRow(event) {
    if (this.onSelectedRow && typeof this.onSelectedRow === 'function') {
      this.onSelectedRow(event, function(...args) {
        this.trigger.apply(this, Array.prototype.concat.call([], events.SELECTED_ROW, args));
      }.bind(this));
    }
  },

  _onSelectedCell(event) {
    if (this.onSelectedCell && typeof this.onSelectedCell === 'function') {
      this.onSelectedRow(event, function(...args) {
        this.trigger.apply(this, Array.prototype.concat.call([], events.SELECTED_CELL, args));
      }.bind(this));
    }
  }
});

ItemView.create = (viewName, options) => {
  let view = ItemView.extend(options);

  view.viewname = viewName;
  Object.defineProperty(view.prototype, 'viewname', { value: viewName, writable: false });

  return view;
};

module.exports = function(toolset) {
  if (!app) {
    app = toolset;
  }
  
  return ItemView;
};