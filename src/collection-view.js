const Backbone = require('backbone');
const Woowahan = require('./woowahan');
const events = require('./events');

const ListViewEvents = [
  events.SELECTED_ROW,
  events.SELECTED_CELL
];

let CollectionView;
let app;

CollectionView = Woowahan.View.create('CollectionView', {
  super() {
    CollectionView.prototype.initialize.apply(this, arguments);
  },

  initialize() {
    this.collection = this.collection || new Backbone.Collection();
    this.collection.on('add', this.addRowView, this);

    this.rowViews = [];

    Woowahan.View.prototype.initialize.apply(this, arguments);
  },
  
  viewWillUnmount() {
    this.rowViews.forEach(row => row.close());
  },

  addRowView(model) {
    let container = this.$(this.rowContainer);

    if (!container.length) {
      container = this.$el;

      if (!this.$el.is(this.rowContainer)) {
        throw('undefined rowContainer');
      }
    }

    this.rowView.prototype.container = container;
    this.rowView.prototype.append = true;

    let view = new this.rowView(model);

    this.rowViews.push(view);
    
    model.on('remove', view.close, view);

    ListViewEvents.forEach(event => view.on(event, this[`on${event.charAt(0).toUpperCase()}${event.slice(1)}`], this));
  },

  reload(data) {
    if (this.collection instanceof Backbone.Collection) {
      let model;

      while (model = this.collection.first()) {
        this.collection.remove(model);
      }

      this.rowViews = [];
    }

    if (Array.isArray(data)) {
      _.each(data, _.bind(function(item) { this.collection.add(item); }, this));
    } else {
      this.collection.add(data);
    }
  },

  getCollection() {
    return this.rowViews.map(view => view.getModel());
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