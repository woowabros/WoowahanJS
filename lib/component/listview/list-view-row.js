import Woowahan from '../../../';
import { SELECTED_ROW, SELECTED_CELL } from './events';

export default Woowahan.View.create('ListViewRow', {

  events: {
    'click': '_onSelectedRow'
  },

  super() {
    Woowahan.View.prototype.initialize.apply(this, arguments);
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