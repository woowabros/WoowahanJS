window.$ = window.jQuery = Woowahan.$;

const DOTIT = 'doit';
const app = new Woowahan();

const reducer = Woowahan.Reducer.create(DOTIT, function() {
  this.env.token = 'efd2341232';
  this.env.timestamp = Date.now();

  this.onSuccess = function(response) {
    this.finish(null, response);
  };

  this.onFail = function(err) {
    this.finish(err);
  };

  this.getData('https://jsonplaceholder.typicode.com/posts/1');
});

const mainView = Woowahan.View.create('mainView', {
  template: Handlebars.compile($('#main-view').html()),

  events: {
    'click #doit': 'onDoit'
  },

  viewDidMount() {
    console.log('view mounted');
  },

  onDoit() {
    this.dispatch(Woowahan.Action.create(DOTIT), function(err, data) {
      console.log(data);
    });
  }
});

/**
 * Middleware
 */
function logger() {
  this.mwtype = 'reducer';
  this.features = ['url', 'type'];

  this.before = function(url, type) {
    console.log(type, url);
  };

  this.after = function(url, type) {
    console.log('after', url, type);
  };
}

function customHeader(headers) {
  this.mwtype = 'reducer';
  this.features = ['headers'];

  this.before = function(header) {
    Object.keys(headers).forEach(k => header[k] = headers[k]);
  };
}

function jsonHeader() {
  this.mwtype = 'reducer';
  this.features = ['headers'];

  this.before = function(header) {
    header['Content-Type'] = 'application/json';
  };
}

/**
 * Use middleware
 */
app.set(logger);
app.set(jsonHeader);
app.set(customHeader, { 'Authorization': 'Bearer {{token}}' });

app.use(reducer);

app.start({
  url: '/', view: mainView, container: '#app'
});
