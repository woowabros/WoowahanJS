/*global _*/
const Woowahan = require('./woowahan');
const events = require('./events');

let ItemView;
let app;

ItemView = Woowahan.View.create('ItemView', {

  events: {
    'click': '_onSelectedRow'
  },

  super() {
    ItemView.prototype.initialize.apply(this, arguments);
  },

  initialize(model) {
    this.setModel(model);
    
    Woowahan.View.prototype.initialize.apply(this, arguments);
  },

  _onSelectedRow(event) {
    if (this.onSelectedRow && typeof this.onSelectedRow === 'function') {
      this.onSelectedRow(event, function(...args) {
        this.trigger.apply(this, _.concat(events.SELECTED_ROW, args));
      }.bind(this));
    }
  },

  _onSelectedCell(event) {
    if (this.onSelectedCell && typeof this.onSelectedCell === 'function') {
      this.onSelectedRow(event, function(...args) {
        this.trigger.apply(this, _.concat(events.SELECTED_CELL, args));
      }.bind(this));
    }
  }
});

ItemView.create = (viewName, options) => {
  let view = ItemView.extend(options);

  view.viewname = viewName;
  Object.defineProperty(view.prototype, 'viewname', {value: viewName, writable: false});

  return view;
};

module.exports = function(toolset) {
  if (!app) {
    app = toolset;
  }
  
  return ItemView;
};