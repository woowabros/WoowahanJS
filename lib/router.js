/*global _ Backbone*/

const MD5 = require('md5');

module.exports = {
  settings: null,
  layouts: [],
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

    while (!!pages.length) {
      page = pages.pop();
      
      if (!!page.url.startsWith('/')) {
        page.url = page.url.substr(1);
      }

      routeId = 'r' + MD5(page.url.toLowerCase() + Date.now());

      options.routes[page.url] = routeId;

      options[routeId] = _.bind(page => {
        if (!!page.layout) {
          if (!this.currentLayout || this.currentLayout != page.layout) {
            const layout = _.find(this.layouts, { viewName: page.layout });
            
            if (!!layout) {
              layout.view.prototype.container = layout.container;
          
              new layout.view();
              
              this.currentLayout = page.layout;
            }
          }
        }
        
        page.view.prototype.container = page.container;
        
        new page.view();
      }, this, page);

      if (!!page.pages && !!page.pages.length) {
        const layout = page.layout || '';
        
        _.each(page.pages, subPage => {
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