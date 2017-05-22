'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*global $ _*/

var Debug = require('debug');
var format = require('util').format;
var Backbone = require('backbone');

var PluginText = require('./plugin/text');
var PluginInputText = require('./plugin/input-text');
var PluginCheckbox = require('./plugin/checkbox');
var PluginSelect = require('./plugin/select');

var delegateEventSplitter = /^(\S+)\s*(.*)$/;
var childEventSplitter = /^\@(\w+)\s*(.*)$/;
var DEFAULT_ATTR_TYPE = 'text';

var MIDDLEWARE = {
  VIEW: 'view'
};

var MIDDLEWARE_PROTOCOL = {
  BEFORE: 'before',
  AFTER: 'after'
};

var View = null;
var viewMount = null;
var app = null;

viewMount = function viewMount() {
  var _this2 = this;

  var tagName = this.tagName;
  var renderData = this.getModel();
  var container = this.container;
  var template = this.template;
  var domStr = void 0;
  var $dom = void 0;

  if (!container) {
    throw '[' + this.viewname + '] Required attribute "container" is missing.';
  } else {
    if (typeof container === 'string') {
      container = $(container);
    }
  }

  if (!container || !container.length) {
    throw '[' + this.viewname + '] "container" is undefined.';
  }

  if (typeof this.viewWillMount === 'function') {
    renderData = this.viewWillMount(renderData) || renderData;
  }

  if (!!template) {
    if (typeof template === 'string') {
      domStr = template;
    } else {
      domStr = template(renderData);
    }

    if (tagName === 'div') {
      var proto = this;

      tagName = '';

      do {
        if (proto.hasOwnProperty('tagName') && !!proto.tagName) {
          tagName = proto.tagName;
          break;
        }
      } while ((proto = proto.__proto__) && proto.viewname !== '___WOOWA_VIEW___');
    }

    if (!!tagName || $(domStr).length > 1) {
      $dom = $('<' + (tagName || 'div') + '>' + domStr + '</' + (tagName || 'div') + '>');
    } else {
      $dom = $(domStr);
    }

    if (!!this.className) {
      $dom.addClass(this.className);
    }

    if (!!this._viewMounted) {
      if ($.contains(container[0], this.el)) {
        this.$el.replaceWith($dom);
      } else {
        container.html($dom);
      }
    } else {
      if (!!this.append) {
        container.append($dom);
      } else if (!!this.prepend) {
        container.prepend($dom);
      } else if (!!this.after) {
        container.after($dom);
      } else {
        container.html($dom);
      }
    }

    this.setElement($dom);
  } else {
    this.setElement(container);
  }

  this._viewMounted = true;
  this._bindRef();
  this._bindModel();

  app.getMiddleware(MIDDLEWARE.VIEW, MIDDLEWARE_PROTOCOL.AFTER).forEach(function (middleware) {
    middleware[MIDDLEWARE_PROTOCOL.AFTER].call(null, _this2, $dom[0]);
  });

  if (typeof this.viewComponentDidMount === 'function') {
    this.viewComponentDidMount($dom);
  }

  if (typeof this.viewDidMount === 'function') {
    this.viewDidMount($dom);
  }

  setTimeout(function () {
    this.dispatch(Woowahan.Event.create('viewDidMount', this));

    this.trigger('viewDidMount');
  }.bind(this), 1);
};

View = Backbone.View.extend({
  super: function _super() {
    View.prototype.initialize.apply(this, arguments);
  },
  initialize: function initialize(model) {
    this._viewMounted = false;
    this._views = {};
    this.debug = Debug('View:' + this.viewname);

    if (!!model) {
      this.setModel(model);
    }

    viewMount.apply(this);
  },


  _plugins: {
    'text': PluginText,
    'input-text': PluginInputText,
    'checkbox': PluginCheckbox,
    'select': PluginSelect
  },

  delegateEvents: function delegateEvents(events) {
    events = events || this.events;

    if (!events) return this;

    this.undelegateEvents();

    for (var key in events) {
      var method = events[key];
      var match = key.match(delegateEventSplitter);
      var childMatch = key.match(childEventSplitter);
      var eventName = void 0;
      var selector = void 0;
      var listener = void 0;

      if (!!childMatch) {
        var index = method.indexOf('(');

        var params = [];

        eventName = childMatch[1];
        selector = childMatch[2];

        if (!!~index) {
          params = method.substring(index + 1, method.length - 1).split(',').map(function (el) {
            return $.trim(el);
          });
          method = method.substring(0, index);
        }

        listener = function (eventName, selector, method, params, event) {
          var _this = this;

          var getVal = function getVal($el) {
            if ($el.is('input[type=checkbox]') || $el.is('input[type=radio]')) {
              return $el.is(':checked');
            } else if ($el.is('select')) {
              return $el.val();
            } else {
              return $el.val() || $el.text();
            }
          };

          var values = params.map(function (param) {
            return getVal(_this.$(param));
          });

          if (eventName === 'submit') {
            var inputs = {};

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = _this.$(selector).find('input, select, textarea')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var el = _step.value;

                inputs[$(el).attr('name')] = getVal($(el));
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

            values.push(inputs);
          }

          if (Object.prototype.toString.call(method) !== '[object Function]') {
            method = this[method];
          }

          for (var _len = arguments.length, args = Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {
            args[_key - 5] = arguments[_key];
          }

          return method.apply(this, Array.prototype.concat.call(values, args, event));
        }.bind(this, eventName, selector, method, params);
      } else {
        if (Object.prototype.toString.call(method) !== '[object Function]') {
          method = this[method];
        }

        if (!method) continue;

        eventName = match[1];
        selector = match[2];

        listener = method.bind(this);
      }

      this.delegate(eventName, selector, listener);
    }

    return this;
  },
  updateView: function updateView(container, ChildView) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    if (!arguments.length) {
      this.close(false);

      viewMount.apply(this);

      return;
    }

    if (!!container && !ChildView) {
      if (!!this._views[container]) {
        this._views[container].close();

        delete this._views[container];
      }

      return;
    }

    if (typeof ChildView != 'function') {
      args = ChildView;
    }

    var viewContainer = typeof container === 'string' ? this.$(container) : container;

    if (!viewContainer.length) {
      viewContainer = $(container);
    }

    var view = this._views[container];

    if (!!view) {
      view.setModel.apply(view, Array.prototype.concat.call(args, { silent: true }));
      view.container = viewContainer;

      if (typeof view.viewWillUnmount === 'function') {
        view.viewWillUnmount.call(view);
      }

      viewMount.apply(this._views[container]);
    } else {
      ChildView.prototype.container = viewContainer;

      view = new (Function.prototype.bind.apply(ChildView, Array.prototype.concat.call(ChildView, args)))();

      this._views[container] = view;
    }

    return view;
  },
  addView: function addView(container, ChildView) {
    this.removeView(container);

    for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      args[_key3 - 2] = arguments[_key3];
    }

    return this.updateView.apply(this, [container, ChildView].concat(args));
  },
  removeView: function removeView(container) {
    this.updateView(container);
  },
  addPopup: function addPopup(view) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var callback = arguments[2];
    // TODO: options 추가
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    view = typeof view === 'string' ? this.getComponent(view) : view;

    var name = view.viewname;

    var containerName = void 0;
    var container = void 0;
    var popup = void 0;

    if (!!view) {
      var _id = options._id || name + 'Container' + Date.now();

      if (!!$('div[data-id=' + _id + ']').length) {
        return;
      }

      containerName = _id;
      container = $('<div data-id="' + containerName + '"></div>');

      $('body').append(container);

      popup = this.addView('div[data-id=' + containerName + ']', view, Object.assign(options, { _id: _id }));

      popup.on('remove', function () {
        popup.off('remove');

        $('div[data-id=' + containerName + ']').remove();
      });

      popup.closePopup = function (containerName, callback, data) {
        this.removeView('div[data-id=' + containerName + ']');

        if (!!callback) {
          callback.call(this, data);
        }
      }.bind(this, containerName, callback);

      return popup;
    } else {
      console.error('undefined popup name [' + name + ']');
    }
  },
  getStates: function getStates(key) {
    return app.getStates(key);
  },
  setStates: function setStates(key, value) {
    app.setStates(key, value);
  },
  getComponent: function getComponent(name) {
    return app.getComponent(name).extend({});
  },
  getRouteTables: function getRouteTables(routeName, params, query) {
    if (routeName === void 0) {
      return app.getRouteTables();
    }

    var path = app.getRouteTables()[routeName];

    if (!path) {
      console.error('"' + routeName + '" not found');
      return;
    }

    if (typeof params === 'string') {
      return path() + '?' + encodeURIComponent(params);
    } else {
      if (typeof query === 'string') {
        return path(params) + '?' + encodeURIComponent(query);
      } else {
        return path(params);
      }
    }
  },
  dispatch: function dispatch(action, subscriber, options) {
    var _$el;

    action.__options = options || {};

    switch (action.wwtype) {
      case 'event':
        (_$el = this.$el).trigger.apply(_$el, [action.type].concat(_toConsumableArray(action.data)));
        break;
      case 'action':
        if (!!subscriber) {
          subscriber = subscriber.bind(this);
        }

        app.dispatch(action, subscriber);
        break;
    }
  },
  setModel: function setModel(key, value) {
    var attrs = void 0;

    if (typeof key === 'string' && typeof value !== 'undefined') {
      attrs = _defineProperty({}, key, value);
    } else {
      attrs = key;
    }

    if (attrs instanceof Backbone.Model) {
      if (!!this.model) {
        this._unbindModel();
      }

      this.model = attrs.clone();

      if (this._viewMounted) {
        this._bindModel();
      }
      return;
    }

    if (Object.prototype.toString.call(attrs) === '[object Null]' || !this.model || !(this.model instanceof Backbone.Model)) {
      this.model = new Backbone.Model();

      if (this._viewMounted) {
        this._bindModel();
      }
    }

    for (var attr in attrs) {
      var _value = this.model.get(attr);

      if (_value !== attrs[attr]) {
        this.model.set(attr, attrs[attr]);
      }
    }
  },
  getModel: function getModel(key) {
    if (!this.model || !(this.model instanceof Backbone.Model)) {
      this.model = new Backbone.Model();
    }

    if (!key) {
      return this.model.clone().toJSON();
    }

    return this.model.clone().get(key);
  },
  log: function log() {
    this.debug(format.apply(this, arguments));
  },
  logStamp: function logStamp() {
    this.log(arguments);
  },
  close: function close(remove) {
    if (typeof this.viewWillUnmount === 'function') {
      this.viewWillUnmount();
    }

    this._unbindModel();
    this._removeChild(remove);

    if (remove + '' != 'false' && !!this) {
      this._unbindRef();
      this.remove();
    }
  },
  remove: function remove() {
    this.trigger('remove', this);

    Backbone.View.prototype.remove.apply(this, arguments);
  },
  _syncElement: function _syncElement(source, target) {
    var $source = $(source);
    var $target = $(target);

    if ($source.is('input[type=text]') || $source.is('input[type=number]') || $source.is('input[type=tel]') || $source.is('textarea')) {
      $target.val($source.val());
    } else if ($source.is('input[type=checkbox]') || $source.is('input[type=radio]')) {
      $target.prop('checked', $source.is(':checked'));
    } else if ($source.is('select')) {
      $target.val($source.val());
    }
  },
  _bindRef: function _bindRef() {
    if (!this.refs) {
      this.refs = {};
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.$el.find('[data-ref]')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var element = _step2.value;

        var $element = $(element);
        var refName = $element.data('ref');
        var refGroup = $element.data('refGroup') || false;
        var refFormRestore = $element.data('refFormRestore') || false;

        if (refGroup) {
          if (this.refs[refName]) {
            this.refs[refName].push(element);
          } else {
            this.refs[refName] = [element];
          }
        } else {
          var currentElement = this.refs[refName];

          this.refs[refName] = element;

          if (currentElement) {
            refFormRestore && this._syncElement(currentElement, this.refs[refName]);
            currentElement = null;
          }
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  },
  _bindModel: function _bindModel() {
    this._unbindModel();

    var targetElements = this.$el.find('[data-role=bind]');

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = targetElements[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var element = _step3.value;

        var key = $(element).data('name');
        var eventName = 'change:' + key;
        var type = ($(element).data('type') || DEFAULT_ATTR_TYPE).toLowerCase();
        var value = this.model.get(key);

        this.listenTo(this.model, eventName, function (element, key, type) {
          var value = this.model.get(key);

          this._plugins[type].call(this, element, value);
        }.bind(this, element, key, type));

        if (typeof value !== 'undefined') this._plugins[type].call(this, element, value);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  },
  _unbindRef: function _unbindRef() {
    for (var ref in this.refs) {
      this.refs[ref] = null;
    }

    this.refs = null;
  },
  _unbindModel: function _unbindModel() {
    this.stopListening(this.model);
  },
  _removeChild: function _removeChild(remove) {
    for (var key in this._views) {
      this._views[key].close.call(this._views[key], remove);
      delete this._views[key];
    }
  }
});

View.create = function (viewName, options) {
  var view = View.extend(options);

  view.viewname = viewName;
  Object.defineProperty(view.prototype, 'viewname', { value: viewName, writable: false });

  return view;
};

module.exports = function (toolset) {
  if (!app) {
    app = toolset;
  }

  return View;
};