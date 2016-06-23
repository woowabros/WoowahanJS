/*global $ _ Backbone*/

var MD5 = require('md5');

module.exports = {
  settings: null,
  layouts: [],
  currentLayout: '',
  
  bindLayout(layout) {
    this.layouts.push(layout);
  },
  
  setLayout(layout) {
    const view = new layout.view();

    let renderData;
    let domStr;

    if (!!view.model) {
      if ('toJSON' in view.model) {
        renderData = view.model.toJSON();
      } else {
        renderData = _.clone(view.model);
      }
    } else {
      renderData = {};
    }

    if ('beforeMount' in view) {
      renderData = view.beforeMount.call(view, renderData) || renderData;
    }

    if (!('template' in view)) {
      console.warn('view는 template를 가져야 합니다.');
    }

    if (typeof view.template === 'string') {
      domStr = view.template;
    } else {
      domStr = `<div>${view.template(renderData)}</div>`;
    }

    if (domStr !== view.el) {
      const className = layout.view.prototype.className;

      var $dom = $(domStr);

      if (!!className) {
        $dom.addClass(className);
      }

      $(layout.container).html($dom);
      view.setElement($dom);

      if ('afterMount' in view) {
        view.afterMount.call(view, $dom);
      }
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
          this.updateLayout(page.layout);
        }
        
        _.delay(() => {
          const view = new page.view();

          let renderData;
          let domStr;

          if (!!view.model) {
            if ('toJSON' in view.model) {
              renderData = view.model.toJSON();
            } else {
              renderData = _.clone(view.model);
            }
          } else {
            renderData = {};
          }

          if ('beforeMount' in view) {
            renderData = view.beforeMount.call(view, renderData) || renderData;
          }

          if (!('template' in view)) {
            console.warn('view는 template를 가져야 합니다.');
          }

          if (typeof view.template === 'string') {
            domStr = view.template;
          } else {
            domStr = `<div>${view.template(renderData)}</div>`;
          }

          if (domStr !== view.el) {
            const className = page.view.prototype.className;

            var $dom = $(domStr);

            if (!!className) {
              $dom.addClass(className);
            }

            $(page.container).html($dom);
            view.setElement($dom);
          }

          if ('afterMount' in view) {
            view.afterMount.call(view, $dom);
          }
        }, 1);
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