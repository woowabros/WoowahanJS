'use strict';

/*global _*/
var Woowahan = require('./woowahan');
var events = require('./events');

var ItemView = void 0;
var app = void 0;

ItemView = Woowahan.View.create('ItemView', {

  events: {
    'click': '_onSelectedRow'
  },

  super: function _super() {
    ItemView.prototype.initialize.apply(this, arguments);
  },
  initialize: function initialize() {
    Woowahan.View.prototype.initialize.apply(this, arguments);
  },
  _onSelectedRow: function _onSelectedRow(event) {
    if (this.onSelectedRow && typeof this.onSelectedRow === 'function') {
      this.onSelectedRow(event, function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        this.trigger.apply(this, _.concat(events.SELECTED_ROW, args));
      }.bind(this));
    }
  },
  _onSelectedCell: function _onSelectedCell(event) {
    if (this.onSelectedCell && typeof this.onSelectedCell === 'function') {
      this.onSelectedRow(event, function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        this.trigger.apply(this, Array.prototype.concat.call(events.SELECTED_CELL, args));
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