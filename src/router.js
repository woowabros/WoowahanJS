const MIDDLEWARE = require('./middleware').MIDDLEWARE;
const MIDDLEWARE_PROTOCOL = require('./middleware').MIDDLEWARE_PROTOCOL;
const MiddlewareRunner = require('./middleware').MiddlewareRunner;

let app;

function urlBuilder(path) {
  return function(params) {
    let url = path;

    if (!params) {
      return url;
    }

    if (Array.isArray(params)) {
      let keys = path.match(/\:\w+/g);

      if (keys.length !== params.length) {
        console.error('It does not match the required input values.');
        return url;
      }

      keys.forEach((key, index) => {
        url = url.replace(key, encodeURIComponent(params[index]));
      });

      return url;
    }

    if (typeof params === 'object') {
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          url = url.replace(':'+key, encodeURIComponent(params[key]));
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
  
  bindLayout(layout) {
    this.layouts.push(layout);
  },

  design(pages, settings = {}, toolset) {
    this.settings = settings;
    this.router = null;

    app = toolset;

    this.bindRouter(Array.isArray(pages) ? pages : [pages]);
  },

  bindRouter(pages) {
    const options = { routes: {} };

    let page, routeId;

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

      options[routeId] = function(page, ...args) {
        const params = {};
        const query = {};
        
        let idx = 0;

        if (page.url.startsWith('*')) {
          params[page.url.split('*')[1]] = args[0];
        } else {
          for (const part of page.url.split('/')) {
            if (part.startsWith(':')) {
              params[part.substr(1)] = decodeURIComponent(args[idx]);

              ++idx;
            }
          }
        }

        const queryStr = decodeURIComponent(args[args.length - 1] || (window.location.search || '').substr(1));

        if (!!queryStr && !!~queryStr.indexOf('=')) {
          const queryArr = queryStr.split('&');

          for (const q of queryArr) {
            const arr = q.split('=');

            if (arr.length === 2) {
              query[arr[0]] = arr[1];
            }
          }
        }
        
        if (!!page.layout) {
          const layout = this.layouts.find(layout => layout.viewName === page.layout);

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

        page.view.prototype.params = params;
        page.view.prototype.query = query;
        page.view.prototype.container = page.container;

        // before

        let middlewares = app.getMiddleware(MIDDLEWARE.ROUTER, MIDDLEWARE_PROTOCOL.BEFORE);

        MiddlewareRunner.run(middlewares, MIDDLEWARE_PROTOCOL.BEFORE, [app], function() {
          console.log('test');
          const view = new page.view();

          if (!!this.currentView) {
            this.currentView.close();
          }

          this.currentView = view;

          middlewares = app.getMiddleware(MIDDLEWARE.ROUTER, MIDDLEWARE_PROTOCOL.AFTER);

          MiddlewareRunner.run(middlewares, MIDDLEWARE_PROTOCOL.AFTER, [app]);
        }.bind(this));
      }.bind(this, page);

      if (!!page.pages && !!page.pages.length) {
        const url = page.originUrl || '';
        const container = page.container || '';
        const layout = page.layout || '';

        for (const subPage of page.pages) {
          if (!subPage.url.startsWith('/')) {
            subPage.url = `${url === '/' ? '' : url}/${subPage.url}`;
          }

          if (!subPage.container) {
            subPage.container = container;
          }

          if (!subPage.layout) {
            subPage.layout = layout;
          }

          pages.push(subPage);
        }
      }
    }

    options.routes['*actions'] = '___NOT_FOUND___';
    options['___NOT_FOUND___'] = actions => {
      if ('empty' in this.settings) {
        this.settings.empty(actions);
      }
    };

    this.router = new (Backbone.Router.extend(options));
  }
};