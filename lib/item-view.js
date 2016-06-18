import View from './view';
import { SELECTED_ROW, SELECTED_CELL } from './events';

const ItemView = View.create('ItemView', {

  events: {
    'click': '_onSelectedRow'
  },

  super() {
    View.prototype.initialize.apply(this, arguments);
  },

  _onSelectedRow(event) {
    this.onSelectedRow(event, function(...args) {
      this.trigger.apply(this, _.concat(SELECTED_ROW, args));
    }.bind(this));
  },

  _onSelectedCell(event) {
    this.onSelectedRow(event, function(...args) {
      this.trigger.apply(this, _.concat(SELECTED_CELL, args));
    }.bind(this));
  }
});

ItemView.create = (viewName, options) => {
  let view = ItemView.extend(options);

  view.viewname = viewName;
  Object.defineProperty(view.prototype, 'viewname', {value: viewName, writable: false});

  return view;
};

export default ItemView;