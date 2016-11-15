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

    var container = this.$(this.rowContainer);

    if (!container.length) {
      container = this.$el;

      if (!this.$el.is(this.rowContainer)) {
        throw 'undefined rowContainer';
      }
    }

    this.rowView.prototype.container = container;
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
      var model = void 0;

      while (model = this.collection.first()) {
        this.collection.remove(model);
      }

      this.rowViews = [];
    }

    if (Array.isArray(data)) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          this.collection.add(item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      this.collection.add(data);
    }
  },
  getCollection: function getCollection() {
    return this.rowViews.map(function (view) {
      return view.getModel();
    });
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