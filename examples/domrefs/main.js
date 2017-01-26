import Woowahan from '../../index';
import MainView from './main-view';

global.$ = global.jQuery = Woowahan.$;

var OtherView = Woowahan.View.create('OtherView', {
  template: '<h1>Other View</h1>'
});

var app = new Woowahan();

app.start({
  url: '/', container: 'body', view: MainView, pages: [
    { url: 'other', view: OtherView }
  ]
});