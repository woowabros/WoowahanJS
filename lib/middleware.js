'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var MIDDLEWARE = exports.MIDDLEWARE = {
  APP: 'app',
  VIEW: 'view',
  REDUCER: 'reducer',
  ROUTER: 'router'
};

var MIDDLEWARE_PROTOCOL = exports.MIDDLEWARE_PROTOCOL = {
  BEFORE: 'before',
  AFTER: 'after',
  UNMOUNT: 'unmount'
};

var queue = [];

var _isRunning = false;

var MiddlewareRunner = exports.MiddlewareRunner = {
  get isRunning() {
    return _isRunning;
  },
  run: function run(middlewares, protocol, params, callback, preprocess) {
    if (!Array.isArray(middlewares) || typeof protocol !== 'string') throw new Error('MiddlewareRunner arguments error');

    if (_isRunning) {
      queue.push([middlewares, protocol, params, callback, preprocess]);

      return;
    }

    _isRunning = true;

    var featuresLen = params.length;

    var index = 0;

    var next = function next() {
      var curr = middlewares[index++];

      if (curr) {
        var middleware = curr[protocol];

        if (middleware.length > featuresLen) {
          middleware.call.apply(middleware, [curr].concat(_toConsumableArray(params), [next]));
        } else {
          middleware.call.apply(middleware, [curr].concat(_toConsumableArray(params)));

          setTimeout(next, 1);
        }
      } else {
        _isRunning = false;

        !!callback && callback();

        var task = queue.shift();

        if (!!task) {
          MiddlewareRunner.run.apply(MiddlewareRunner, _toConsumableArray(task));
        }
      }
    };

    if (typeof preprocess === 'function') preprocess();

    next();
  }
};