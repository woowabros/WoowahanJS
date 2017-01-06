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
    this.order = 'sequence';

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

    switch(this.order) {
      case 'reverse':
        this.rowView.prototype.prepend = true;
        break;
      default:
        this.rowView.prototype.append = true;
    }

    let view = new this.rowView(model);

    this.rowViews.push(view);

    model.on('remove', view.close, view);

    model.on('change', (data) => {
      view.setModel(data.toJSON());
      view.updateView();
    }, view);

    ListViewEvents.forEach(event => view.on(event, this[`on${event.charAt(0).toUpperCase()}${event.slice(1)}`], this));
  },

  reload(data, options = {}) {
    const uid = options.uid;

    let renderData = data.filter(item => !!item).map(item => {
      if (!!uid) {
        const model = this.collection.findWhere({ [uid]: item[uid] });

        if (!!model) {
          model.set(item);

          return model;
        }
      }

      return item;
    });

    this.order = ('order' in options) ? options.order : 'sequence';

    this.collection.set(renderData, { remove: ('reset' in options) ? options.reset : true });
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