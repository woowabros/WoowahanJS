import Backbone from 'backbone';
import { CoreView } from '../../core';
import { SELECTED_ROW, SELECTED_CELL } from './events';

const ListViewEvents = [
  SELECTED_ROW,
  SELECTED_CELL
];

export default CoreView.extend({
  rowViews: [],

  initialize() {
    CoreView.prototype.initialize.apply(this, arguments);

    this.collection = this.collection || new Backbone.Collection();
    this.collection.on('add', this.addRowView, this);
  },

  addRowView(model) {
    let view = new this.rowView(model);

    this.rowViews.push(view);
    this.$el.find(this.rowContainer).append(view.render().$el);

    model.on('remove', view.close, view);

    ListViewEvents.forEach(event => view.on(event, this[`on${event.charAt(0).toUpperCase()}${event.slice(1)}`], this));
  },

  reload(data) {
    if (this.collection instanceof Backbone.Collection) {
      this.collection.remove(this.collection.map(model => model));
    }

    this.collection.add(data);
  },

  onSelectedRow() {
    this.logStamp('selectedRow');
  },

  onSelectedCell() {
    this.logStamp('selectedCell');
  },

  onClose() {
    this.rowViews.forEach(row => row.close());
  }
});