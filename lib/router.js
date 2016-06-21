/*global $ _ Backbone*/

import MD5 from 'md5';

export default {
  settings: null,
  layouts: [],
  currentLayout: '',
  
  bindLayout(layout) {
    this.layouts.push(layout);
  },
  
  setLayout(layout) {
    const container = layout.container;
    const view = layout.view;
    
    // TODO: View 의 el을 받아주기보다 el을 사용하지 않도록 강제하는 방향으로 수정
    if (!!view.prototype.el) {
      new view();
    } else {
      $(container).html(new view().render().$el);
    }
  },
  
  updateLayout(layoutName) {
    if (!!this.currentLayout && this.currentLayout.viewName == layoutName) return;
    
    const layout = _.find(this.layouts, { viewName: layoutName });
    
    if (!!layout) {
      this.setLayout(layout);
      
      this.currentLayout = layoutName;
    }
  },

  design(pages, settings = {}) {
    this.settings = settings;

    this.router = null;
    
    if (!Array.isArray(pages)) {
      pages = [pages];
    }

    this.bindRouter(pages);
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
          this.updateLayout(page.layout);
        }
        
        _.delay(_ => {
          $(page.container).html(new page.view().render().$el);
        }, 1);
      }, this, page);

      if (!!page.pages && !!page.pages.length) {
        const layout = page.layout || '';
        
        _.each(page.pages, subPage => {
          subPage.layout = layout;
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