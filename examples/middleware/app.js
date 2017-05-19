Woowahan.config = {
  testMode: true
};

window.$ = window.jQuery = Woowahan.$;

const DOTIT = 'doit';
const app = new Woowahan();
const COLOR = {
  view: function(alpha) {
    if (alpha) {
      return 'rgba(51,202,255,0.4)';
    } else {
      return 'rgb(51,202,255)';
    }
  },
  node: function(alpha) {
    if (alpha) {
      return 'rgba(249,67,4,0.5)';
    } else {
      return 'rgb(249,67,4)';
    }
  }
};

const reducer = Woowahan.Reducer.create(DOTIT, function() {
  this.env.token = `TK-${Date.now()}`;

  this.onSuccess = function(response) {
    this.finish(null, response);
  };

  this.onFail = function(err) {
    this.finish(err);
  };

  this.getData('https://jsonplaceholder.typicode.com/posts/2');
});

const childView = Woowahan.View.create('childView', {
  template: Handlebars.compile($('#child-view').html()),

  events: {
    'click .btn': 'onClick'
  },

  onClick() {

  }
});

const mainView = Woowahan.View.create('mainView', {
  template: Handlebars.compile($('#main-view').html()),

  events: {
    'change input[type=text]': 'onChange',
    'change input[type=password]': 'onChange',
    'click .btn': 'onDoit',
    'click .name': 'onName',
    'click #update': 'onUpdate'
  },

  viewDidMount() {
    this.updateView('#child', childView);
  },

  onChange() {

  },

  onDoit() {
    this.dispatch(Woowahan.Action.create(DOTIT), function(err, data) {
      console.log(data);
    });
  },

  onName() {

  },

  onUpdate() {
    this.updateView();
  }
});

/**
 * Middleware
 */
function logger() {
  this.mwtype = 'reducer';
  this.features = ['url', 'type'];

  this.before = function(feature) {
    console.log(feature.type, feature.url);
  };
}

function customHeader(headers) {
  this.mwtype = 'reducer';
  this.features = ['headers'];

  this.before = function(feature, env) {
    Object.keys(headers).forEach(k => feature.headers[k] = env.template(headers[k], env));
  };
}

function jsonHeader() {
  this.mwtype = 'reducer';
  this.features = ['headers'];

  this.before = function(feature) {
    feature.headers['Content-Type'] = 'application/json';
  };
}

function GALogger(gaKey) {
  this.mwtype = 'router';
  this.features = ['params', 'query'];

  this.before = function(feature) {
    console.log(`key: ${gaKey}, data: ${JSON.stringify(feature)}`);
  }
}

function WoowahanDevtools() {
  let w = window;
  let ctrl = document.createElement('div');
  let c = document.createElement('canvas');
  let ctx = c.getContext('2d');
  let components = [];
  let isAttach = false;
  let isOption = false;
  let isVisible = false;
  let rect = {
    get width() {
      return w.innerWidth;
    },
    get height() {
      return w.innerHeight;
    }
  };

  ctrl.style.position = 'fixed';
  ctrl.style.top = '60px';
  ctrl.style.right = '10px';
  ctrl.style.width = '30px';
  ctrl.style.height = '30px';
  ctrl.style.background = 'red';
  ctrl.style.borderRadius = '15px';
  ctrl.style.opacity = 0.2;
  ctrl.style.zIndex = 999999;

  document.body.append(ctrl);

  ctrl.addEventListener('mouseover', function() {
    this.style.opacity = 0.4;
  });

  ctrl.addEventListener('mouseout', function() {
    this.style.opacity = 0.2;
  });

  ctrl.addEventListener('click', function() {
    isVisible = !isVisible;
  });

  this.mwtype = 'view';

  function addComponent(component) {
    let cid = component.dataset.componentId;

    if (components.filter(comp => comp.dataset.componentId === cid).length === 0) {
      components.push(component);
    }
  }

  c.setAttribute('width', rect.width);
  c.setAttribute('height', rect.height);
  c.style.display = 'none';
  c.style.position = 'fixed';
  c.style.left = 0;
  c.style.top = 0;

  w.addEventListener('resize', function() {
    c.setAttribute('width', rect.width);
    c.setAttribute('height', rect.height);
  });

  window.requestAnimationFrame(devmode);

  function devmode() {
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (isVisible) {
      if (c.style.display === 'none') {
        c.style.display = 'block';
      }

      document.querySelector('#app').style.opacity = 0.3;

      if (Woowahan.config.testMode) {
        components.forEach(comp => {
          let rect = comp.getBoundingClientRect();

          ctx.save();

          if (comp.dataset.componentViewName) {
            ctx.font = '24pt verdana';
            ctx.fillStyle = COLOR.view(true);
            ctx.strokeStyle = COLOR.view(false);
            ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
            ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
            ctx.fillStyle = 'black';
            ctx.fillText(comp.dataset.componentViewName, rect.left + 20, rect.top + 40);
          } else {
            ctx.font = '11px verdana';
            ctx.fillStyle = COLOR.node(true);
            ctx.strokeStyle = COLOR.node(false);
            ctx.strokeRect(rect.left+0.5, rect.top+0.5, rect.width, rect.height);

            if (isOption) {
              ctx.fillStyle = COLOR.node(false);
              ctx.fillText(`${comp.dataset.componentHandlerName} #${comp.dataset.componentId}`, rect.left, rect.top+rect.height+20);
            }
          }

          ctx.restore();

        });
      }
    } else {
      document.querySelector('#app').style.opacity = 1;
      if (c.style.display === 'block') c.style.display = 'none';
    }

    requestAnimationFrame(devmode);
  }

  this.after = function(view, dom) {
    let idx = 0;

    if (!isAttach) {
      document.body.appendChild(c);
      isAttach = true;
    }

    dom.setAttribute('data-component-id', view.viewname+'.'+(++idx));
    dom.setAttribute('data-component-view-name', view.viewname);

    addComponent(dom);

    if (view.events) {
      Object.keys(view.events).forEach(event => {
        dom.querySelectorAll(event.split(' ')[1]).forEach(node => {
          node.setAttribute('data-component-id', view.viewname+'.'+(++idx));
          node.setAttribute('data-component-handler-name', view.events[event]);
          addComponent(node);
        });
      });
    }
  }
}
/**
 * Use middleware
 */
app.set(logger);
app.set(customHeader, { 'X-Authorization': 'Bearer {{token}}' });
app.set(jsonHeader);
app.set(WoowahanDevtools);
app.set(GALogger, 'qwertyuiop');

app.use(reducer);

Woowahan.testDef = function(view) {
  view.def = {
    'onDoit': '이것은 디스패치다'
  };
};

Woowahan.testDef(mainView);

app.start({
  url: '/', view: mainView, container: '#app'
});
