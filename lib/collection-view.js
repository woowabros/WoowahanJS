'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    this.reverse = false;

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

    if (this.reverse) {
      this.rowView.prototype.prepend = true;
    } else {
      this.rowView.prototype.append = true;
    }

    var view = new this.rowView(model);

    this.rowViews.push(view);

    model.on('remove', view.close, view);

    model.on('change', function (data) {
      view.setModel(data.toJSON());
      view.updateView();
    }, view);

    ListViewEvents.forEach(function (event) {
      return view.on(event, _this['on' + event.charAt(0).toUpperCase() + event.slice(1)], _this);
    });
  },
  reload: function reload(data) {
    var _this2 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (Object.prototype.toString.call(options) !== '[object Object]') {
      throw 'invalid options!!!';
    }

    var uid = options.uid;

    var renderData = data.filter(function (item) {
      return !!item;
    }).map(function (item) {
      if (!!uid) {
        var model = _this2.collection.findWhere(_defineProperty({}, uid, item[uid]));

        if (!!model) {
          model.set(item);

          return model;
        }
      }

      return item;
    });

    this.reverse = 'reverse' in options ? options.reverse : false;

    this.collection.set(renderData, { remove: 'reset' in options ? options.reset : true });
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