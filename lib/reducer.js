'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*global $*/

var MIDDLEWARE = {
  REDUCER: 'reducer'
};

var MIDDLEWARE_PROTOCOL = {
  BEFORE: 'before',
  AFTER: 'after'
};

var defaultConfiguration = {
  timeout: 5000
};

var defaultFeatureValue = {
  headers: {},
  url: '',
  type: '',
  timeout: defaultConfiguration.timeout
};

var Reducer = void 0;
var app = void 0;

Reducer = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
  queueSuccess: [],
  queueFail: [],
  extend: function extend(protoProps) {
    var child = Object.assign({}, this);

    if (!!protoProps.onSuccess) {
      child.queueSuccess.push(protoProps.onSuccess);
    }

    if (!!protoProps.onFail) {
      child.queueFail.push(protoProps.onFail);
    }

    return child;
  },
  create: function create(actionName, schema, handler) {
    var _this2 = this;

    if (typeof schema === 'function') {
      handler = schema;
      schema = void 0;
    } else {
      if ((typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) === 'object' && schema.wwtype !== 'schema') {
        throw new Error('The second argument of reducer will only function, or schema objects.');
      }
    }

    var _this = this;

    var Reducer = function Reducer(data, subscriber) {
      this._timestamp = Date.now();
      this._id = actionName.toLowerCase() + this._timestamp;
      this.subscriber = subscriber;
      this.queueSuccess = [];
      this.queueFail = [];

      this.useraction(data);
      this.addAction(this._id);
    };

    Reducer.wwtype = 'reducer';
    Reducer.actionName = actionName;
    Reducer.schema = schema;

    var fn = Object.assign(Reducer.prototype, {
      onSuccess: _this.onSuccess,
      onFail: _this.onFail
    });

    fn.useraction = handler;

    fn.id = function () {
      return _this2._id;
    };
    fn.actionName = actionName;
    fn.createtime = function () {
      return _this2._timestamp;
    };
    fn.addAction = function (id) {
      return app.addAction(id);
    };
    fn.addError = function (err) {
      return app.addError(err);
    };
    fn.removeAction = function (id) {
      return app.removeAction(id);
    };
    fn.getStates = function () {
      return app.getStates();
    };

    fn.use = function (key, handlers) {
      switch (key) {
        case _this.SUCCESS:
          if (!handlers) return;

          if (Array.isArray(handlers)) {
            Array.prototype.push.apply(this.queueSuccess, handlers);
          } else {
            this.queueSuccess.push(handlers);
          }
          break;
        case _this.FAIL:
          if (!handlers) return;

          if (Array.isArray(handlers)) {
            Array.prototype.push.apply(this.queueFail, handlers);
          } else {
            this.queueFail.push(handlers);
          }
          break;
        default:
          throw 'undefined key';
      }
    };

    fn.loadScript = function (path, id) {
      if (!id) {
        id = path.toLowerCase();
      }

      var script = $('script[id=' + id + ']');

      if (!!script.length) {
        (this.onSuccess || this.success).call(this);
        return;
      }

      script = document.createElement('script');

      document.getElementsByTagName('head')[0].appendChild(script);

      script.addEventListener('load', (this.onSuccess || this.success).bind(this));
      script.addEventListener('error', (this.onFail || this.fail).bind(this));

      script.id = id;
      script.type = 'text/javascript';
      script.src = path;
    };

    fn.requestData = function (url, settings) {
      var _this3 = this;

      var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';

      if ((typeof url === 'undefined' ? 'undefined' : _typeof(url)) === 'object') {
        settings = Object.assign({}, defaultConfiguration, { url: url });
      } else {
        settings = Object.assign({}, defaultConfiguration, settings, { url: url });
      }

      settings.type = method.toUpperCase();

      var success = function success() {
        var queueSuccess = Array.prototype.concat.call(_this.queueSuccess, this.queueSuccess);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (!!queueSuccess.length || !!this.onSuccess) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = queueSuccess[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var item = _step.value;

              item.apply(this, args);
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

          !!this.onSuccess && this.onSuccess.apply(this, args);
        } else {
          this.success.apply(this, args);
        }
      };

      var fail = function fail() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var queueFail = Array.prototype.concat.call(_this.queueFail, this.queueFail);
        var jqXHR = args[0];

        if (!!jqXHR) {
          args = [{
            status: jqXHR.status,
            statusText: jqXHR.statusText || '',
            response: jqXHR.responseJSON || jqXHR.responseText
          }];
        }

        if (!!queueFail.length || !!this.onFail) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = queueFail[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var item = _step2.value;

              item.apply(this, args);
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

          !!this.onFail && this.onFail.apply(this, args);
        } else {
          this.fail.apply(this, args);
        }
      };

      app.getMiddleware(MIDDLEWARE.REDUCER, MIDDLEWARE_PROTOCOL.BEFORE).forEach(function (middleware) {
        if (MIDDLEWARE_PROTOCOL.BEFORE in middleware) {
          (function () {
            var featureList = {};

            middleware.features.forEach(function (feature) {
              if (defaultFeatureValue.hasOwnProperty(feature)) {
                if (!settings.hasOwnProperty(feature)) {
                  settings[feature] = defaultFeatureValue[feature];
                }

                featureList[feature] = settings[feature];
              }
            });

            middleware[MIDDLEWARE_PROTOCOL.BEFORE].call(null, featureList, Object.assign({}, _this3.env));
          })();
        }
      });

      return $.ajax(settings).done(success.bind(this)).fail(fail.bind(this));
    };

    /**
     *
     * @param url
     * @param settings
     */
    fn.getData = function (url, settings) {
      return this.requestData(url, settings, 'get');
    };

    /**
     *
     * @param url
     * @param settings
     */
    fn.putData = function (url, settings) {
      return this.requestData(url, settings, 'put');
    };

    /**
     *
     * @param url
     * @param settings
     */
    fn.postData = function (url, settings) {
      return this.requestData(url, settings, 'post');
    };

    /**
     *
     * @param url
     * @param settings
     */
    fn.deleteData = function (url, settings) {
      return this.requestData(url, settings, 'delete');
    };

    fn.success = function (data) {};

    fn.fail = function (request, error) {
      if ('abort' in request) {
        request.abort();
      }

      //TODO: 오류 발생시 바로 삭제하지 않고 작업을 Disable 시킨 후 오류 처리시 Retry 등의 로직을 수행할 수 있도록 선택지를 만듬
      this.removeAction(this._id);
      this.addError(error);
    };

    fn.finish = function (data, options) {
      options = options || null;

      this.subscriber && this.subscriber.call(this, data, options);
      this.removeAction(this._id);
    };

    fn.env = {};
    fn.env.template = function (templateStr, env) {
      if (typeof templateStr !== 'string') return templateStr;

      var renderStr = templateStr;
      var variables = templateStr.match(/{{\w+}}/g);

      if (variables) {
        variables.forEach(function (v) {
          var attrName = v.replace('{{', '').replace('}}', '');

          if (attrName in env) {
            renderStr = renderStr.replace(v, env[attrName]);
          }
        });
      }

      return renderStr;
    };

    return Reducer;
  }
};

module.exports = function (toolset) {
  if (!app) {
    app = toolset;
  }

  return Reducer;
};