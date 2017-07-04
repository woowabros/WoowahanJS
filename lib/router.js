'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*global _ Backbone*/

var MIDDLEWARE = {
  ROUTER: 'router'
};

var MIDDLEWARE_PROTOCOL = {
  BEFORE: 'before',
  AFTER: 'after'
};

var app = void 0;

function urlBuilder(path) {
  return function (params) {
    var url = path;

    if (!params) {
      return url;
    }

    if (Array.isArray(params)) {
      var keys = path.match(/\:\w+/g);

      if (keys.length !== params.length) {
        console.error('It does not match the required input values.');
        return url;
      }

      keys.forEach(function (key, index) {
        url = url.replace(key, encodeURIComponent(params[index]));
      });

      return url;
    }

    if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          url = url.replace(':' + key, encodeURIComponent(params[key]));
        }
      }

      return url;
    }

    console.error('Invalid params type');
    return url;
  };
}

module.exports = {
  routeTables: {},
  settings: null,
  layouts: [],
  currentView: '',
  currentLayout: '',

  bindLayout: function bindLayout(layout) {
    this.layouts.push(layout);
  },
  design: function design(pages) {
    var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var toolset = arguments[2];

    this.settings = settings;
    this.router = null;

    app = toolset;

    this.bindRouter(Array.isArray(pages) ? pages : [pages]);
  },
  bindRouter: function bindRouter(pages) {
    var _this = this;

    var options = { routes: {} };

    var page = void 0,
        routeId = void 0;

    pages = Array.from(pages);

    while (!!pages.length) {
      page = pages.shift();

      this.routeTables[page.routeName || page.view.viewname] = urlBuilder(page.url);

      page.originUrl = page.url;

      if (page.url.startsWith('/')) {
        page.url = page.url.substr(1);
      }

      routeId = 'r' + page.url.toLowerCase() + Date.now();

      options.routes[page.url] = routeId;

      options[routeId] = function (page) {
        var _ref;

        var params = {};
        var query = {};

        var idx = 0;

        if (page.url.startsWith('*')) {
          params[page.url.split('*')[1]] = arguments.length <= 1 ? undefined : arguments[1];
        } else {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = page.url.split('/')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var part = _step.value;

              if (part.startsWith(':')) {
                params[part.substr(1)] = decodeURIComponent(arguments.length <= idx + 1 ? undefined : arguments[idx + 1]);

                ++idx;
              }
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
        }

        var queryStr = decodeURIComponent((_ref = (arguments.length <= 1 ? 0 : arguments.length - 1) - 1 + 1, arguments.length <= _ref ? undefined : arguments[_ref]) || (window.location.search || '').substr(1));

        if (!!queryStr && !!~queryStr.indexOf('=')) {
          var queryArr = queryStr.split('&');

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = queryArr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var q = _step2.value;

              var arr = q.split('=');

              if (arr.length === 2) {
                query[arr[0]] = arr[1];
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
        }

        if (!!page.layout) {
          var layout = this.layouts.find(function (layout) {
            return layout.viewName === page.layout;
          });

          if (!this.currentLayout || this.currentLayout.viewname !== page.layout) {
            if (!!layout) {
              !!this.currentLayout && this.currentLayout.close();

              layout.view.prototype.params = params;
              layout.view.prototype.query = query;
              layout.view.prototype.container = layout.container;

              this.currentLayout = new layout.view();
            }
          } else {
            if (layout.options.update) {
              this.currentLayout['params'] = params;
              this.currentLayout['query'] = query;

              this.currentLayout.updateView();
            }
          }
        }

        app.getMiddleware(MIDDLEWARE.ROUTER, MIDDLEWARE_PROTOCOL.BEFORE).forEach(function (middleware) {
          if (MIDDLEWARE_PROTOCOL.BEFORE in middleware) {
            var featureList = {};
            var features = middleware.features || [];

            if (features.includes('params')) {
              featureList['params'] = params;
            }

            if (features.includes('query')) {
              featureList['query'] = query;
            }

            middleware[MIDDLEWARE_PROTOCOL.BEFORE].call(null, featureList);
          }
        });

        page.view.prototype.params = params;
        page.view.prototype.query = query;
        page.view.prototype.container = page.container;

        var view = new page.view();

        if (!!this.currentView) {
          this.currentView.close();
        }

        this.currentView = view;
      }.bind(this, page);

      if (!!page.pages && !!page.pages.length) {
        var url = page.originUrl || '';
        var container = page.container || '';
        var layout = page.layout || '';

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = page.pages[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var subPage = _step3.value;

            if (!subPage.url.startsWith('/')) {
              subPage.url = (url === '/' ? '' : url) + '/' + subPage.url;
            }

            if (!subPage.container) {
              subPage.container = container;
            }

            if (!subPage.layout) {
              subPage.layout = layout;
            }

            pages.push(subPage);
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
      }
    }

    options.routes['*actions'] = '___NOT_FOUND___';
    options['___NOT_FOUND___'] = function (actions) {
      if ('empty' in _this.settings) {
        _this.settings.empty(actions);
      }
    };

    this.router = new (Backbone.Router.extend(options))();
  }
};