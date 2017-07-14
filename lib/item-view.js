'use strict';

var Woowahan = require('./woowahan');
var events = require('./events');

var ItemView = void 0;
var app = void 0;

ItemView = Woowahan.View.create('ItemView', {

  events: {
    'click': '_onSelectedRow'
  },

  super: function _super() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    ItemView.prototype.initialize.apply(this, args);
  },
  initialize: function initialize() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    Woowahan.View.prototype.initialize.apply(this, args);
  },
  _onSelectedRow: function _onSelectedRow(event) {
    if (this.onSelectedRow && typeof this.onSelectedRow === 'function') {
      this.onSelectedRow(event, function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        this.trigger.apply(this, Array.prototype.concat.call([], events.SELECTED_ROW, args));
      }.bind(this));
    }
  },
  _onSelectedCell: function _onSelectedCell(event) {
    if (this.onSelectedCell && typeof this.onSelectedCell === 'function') {
      this.onSelectedRow(event, function () {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        this.trigger.apply(this, Array.prototype.concat.call([], events.SELECTED_CELL, args));
      }.bind(this));
    }
  }
});

ItemView.create = function (viewName, options) {
  var view = ItemView.extend(options);

  view.viewname = viewName;
  Object.defineProperty(view.prototype, 'viewname', { value: viewName, writable: false });

  return view;
};

module.exports = function (toolset) {
  if (!app) {
    app = toolset;
  }

  return ItemView;
};