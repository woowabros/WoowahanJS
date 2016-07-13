var app = new Woowahan();

app.use(Woowahan.Reducer.create('noti', function(message) {
  this.finish(message);
}));

var HelloView = Woowahan.View.create('HelloView', {
  template: Handlebars.compile('<h1>Hello, <button class="viewname">{{viewName}}</button></h1>'),
  events: {
    'click .viewname': 'onViewName'
  },

  viewWillMount: function(renderData) {
    renderData.viewName = this.viewname;
    return renderData;
  },

  onViewName() {
    this.dispatch(Woowahan.Action.create('noti', 'ok'), message => alert(message));
  }
});

app.start({
  url: '/',
  container: '#content',
  view: HelloView
});