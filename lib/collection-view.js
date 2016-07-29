'use strict';

var Backbone = require('backbone');
var Woowahan = require('./woowahan');
var events = require('./events');

var ListViewEvents = [events.SELECTED_ROW, events.SELECTED_CELL];

var CollectionView = void 0;
var app = void 0;

CollectionView = Woowahan.View.create('CollectionView', {
  super: function _super() {
    CollectionView.prototype.initialize.apply(this, arguments);
  },
  initialize: function initialize() {
    this.collection = this.collection || new Backbone.Collection();
    this.collection.on('add', this.addRowView, this);

    this.rowViews = [];

    Woowahan.View.prototype.initialize.apply(this, arguments);
  },
  viewWillUnmount: function viewWillUnmount() {
    this.rowViews.forEach(function (row) {
      return row.close();
    });
  },
  addRowView: function addRowView(model) {
    var _this = this;

    this.rowView.prototype.container = this.$(this.rowContainer);
    this.rowView.prototype.append = true;

    var view = new this.rowView(model);

    this.rowViews.push(view);

    model.on('remove', view.close, view);

    ListViewEvents.forEach(function (event) {
      return view.on(event, _this['on' + event.charAt(0).toUpperCase() + event.slice(1)], _this);
    });
  },
  reload: function reload(data) {
    if (this.collection instanceof Backbone.Collection) {
      this.collection.remove(this.collection.map(function (model) {
        return model;
      }));
    }

    this.collection.add(data);
  },
  onSelectedRow: function onSelectedRow() {
    this.log('selectedRow');
  },
  onSelectedCell: function onSelectedCell() {
    this.log('selectedCell');
  },
  onAction: function onAction() {
    this.log('onAction');
  },
  onClose: function onClose() {
    this.rowViews.forEach(function (row) {
      return row.close();
    });
  }
});

CollectionView.create = function (viewName, options) {
  var view = CollectionView.extend(options);

  view.viewname = viewName;
  Object.defineProperty(view.prototype, 'viewname', { value: viewName, writable: false });

  return view;
};

module.exports = function (toolset) {
  if (!app) {
    app = toolset;
  }

  return CollectionView;
};