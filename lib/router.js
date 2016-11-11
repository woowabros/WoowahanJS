'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*global _ Backbone*/

var MD5 = require('md5');

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
        url = url.replace(':' + key, encodeURIComponent(params[key]));
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

    this.settings = settings;

    this.router = null;

    this.bindRouter(Array.isArray(pages) ? pages : [pages]);
  },
  bindRouter: function bindRouter(pages) {
    var _this = this;

    var options = { routes: {} };

    var page = void 0,
        routeId = void 0;

    pages = _.cloneDeep(pages);

    while (!!pages.length) {
      page = pages.shift();

      this.routeTables[page.routeName || page.view.viewname] = urlBuilder(page.url);

      page.originUrl = page.url;

      if (!!page.url.startsWith('/')) {
        page.url = page.url.substr(1);
      }

      routeId = 'r' + MD5(page.url.toLowerCase() + Date.now());

      options.routes[page.url] = routeId;

      options[routeId] = _.bind(function (page) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var params = {};
        var query = {};

        var idx = 0;

        if (page.url.startsWith('*')) {
          params[page.url.split('*')[1]] = args[0];
        } else {
          _.each(page.url.split('/'), function (part) {
            if (part.startsWith(':')) {
              params[part.substr(1)] = decodeURIComponent(args[idx++]);
            }
          });
        }

        var queryStr = decodeURIComponent(args[args.length - 1]);

        if (!!queryStr && !!~queryStr.indexOf('=')) {
          var queryArr = queryStr.split('&');

          _.each(queryArr, function (q) {
            var arr = q.split('=');

            if (arr.length == 2) {
              query[arr[0]] = arr[1];
            }
          });
        }

        if (!!page.layout) {
          if (!this.currentLayout || this.currentLayout.viewname != page.layout) {
            var layout = _.find(this.layouts, { viewName: page.layout });

            if (!!layout) {
              !!this.currentLayout && this.currentLayout.close();

              layout.view.prototype.params = params;
              layout.view.prototype.query = query;
              layout.view.prototype.container = layout.container;

              this.currentLayout = new layout.view();
            }
          } else {
            this.currentLayout.params = params;
            this.currentLayout.query = query;

            this.currentLayout.updateView();
          }
        }

        page.view.prototype.params = params;
        page.view.prototype.query = query;
        page.view.prototype.container = page.container;

        var view = new page.view();

        if (!!this.currentView) {
          this.currentView.close();
        }

        this.currentView = view;
      }, this, page);

      if (!!page.pages && !!page.pages.length) {
        (function () {
          var url = page.originUrl || '';
          var container = page.container || '';
          var layout = page.layout || '';

          _.each(page.pages, function (subPage) {
            if (!subPage.url.startsWith('/')) {
              subPage.url = url + '/' + subPage.url;
            }

            if (!subPage.container) {
              subPage.container = container;
            }

            if (!subPage.layout) {
              subPage.layout = layout;
            }

            pages.push(subPage);
          });
        })();
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