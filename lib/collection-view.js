var Backbone = require('backbone');
var Woowahan = require('./woowahan');
var events = require('./events');

const ListViewEvents = [
  events.SELECTED_ROW,
  events.SELECTED_CELL
];

let app;

const CollectionView = Woowahan.View.create('CollectionView', {
  rowViews: [],

  super() {
    CollectionView.prototype.initialize.apply(this, arguments);
  },

  initialize() {
    this.collection = this.collection || new Backbone.Collection();
    this.collection.on('add', this.addRowView, this);

    Woowahan.View.prototype.initialize.apply(this, arguments);
  },
  
  viewWillUnmount() {
    this.rowViews.forEach(row => row.close());
  },

  addRowView(model) {
    this.rowView.prototype.container = this.$(this.rowContainer);
    this.rowView.prototype.append = true;

    let view = new this.rowView(model);

    this.rowViews.push(view);
    
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
    this.log('selectedRow');
  },

  onSelectedCell() {
    this.log('selectedCell');
  },

  onAction() {
    this.log('onAction');
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

module.exports = function(toolset) {
  if (!app) {
    app = toolset;
  }
  
  return CollectionView;
};