/*global _ Backbone*/

const MD5 = require('md5');

module.exports = {
  settings: null,
  layouts: [],
  views: {},
  currentLayout: '',
  
  bindLayout(layout) {
    this.layouts.push(layout);
  },

  design(pages, settings = {}) {
    this.settings = settings;

    this.router = null;

    this.bindRouter(Array.isArray(pages) ? pages : [pages]);
  },

  bindRouter(pages) {
    const options = { routes: {} };

    let page, routeId;
    
    pages = _.cloneDeep(pages);

    while (!!pages.length) {
      page = pages.shift();
      
      if (!!page.url.startsWith('/')) {
        page.url = page.url.substr(1);
      }

      routeId = 'r' + MD5(page.url.toLowerCase() + Date.now());

      options.routes[page.url] = routeId;

      options[routeId] = _.bind(function(page, ...args) {
        const params = {};
        const query = {};
        
        let idx = 0;
        
        if (page.url.startsWith('*')) {
          params[page.url.split('*')[1]] = args[0];
        } else {
          _.each(page.url.split('/'), function(part) {
            if (part.startsWith(':')) {
              params[part.substr(1)] = args[idx++];
            }
          });
        }

        const queryStr = args[args.length - 1];

        if (!!queryStr && !!~queryStr.indexOf('=')) {
          const queryArr = queryStr.split('&');

          _.each(queryArr, function(q) {
            const arr = q.split('=');

            if (arr.length == 2) {
              query[arr[0]] = arr[1];
            }
          });
        }
        
        if (!!page.layout) {
          if (!this.currentLayout || this.currentLayout.viewname != page.layout) {
            const layout = _.find(this.layouts, { viewName: page.layout });
            
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
        
        if (!!this.views[page.url]) {
          this.views[page.url].close();
        }
        this.views[page.url] = new page.view();
      }, this, page);

      if (!!page.pages && !!page.pages.length) {
        const url = page.url || '';
        const container = page.container || '';
        const layout = page.layout || '';
        
        _.each(page.pages, subPage => {
          if (!subPage.url.startsWith('/')) {
            subPage.url = `${url}/${subPage.url}`;
          }
          
          if (!subPage.container) {
            subPage.container = container;
          }
          
          if (!subPage.layout) {
            subPage.layout = layout;
          }
          
          pages.push(subPage);
        });
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