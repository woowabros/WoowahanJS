var Backbone = require('backbone');
var View = require('./view');
var events = require('./events');

const ListViewEvents = [
  events.SELECTED_ROW,
  events.SELECTED_CELL
];

const CollectionView = View.create('CollectionView', {
  rowViews: [],

  super() {
    View.prototype.initialize.apply(this, arguments);

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

CollectionView.create = (viewName, options) => {
  let view = CollectionView.extend(options);

  view.viewname = viewName;
  Object.defineProperty(view.prototype, 'viewname', {value: viewName, writable: false});

  return view;
};

module.exports = CollectionView;