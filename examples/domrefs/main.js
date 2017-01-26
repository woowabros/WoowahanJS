import Woowahan from '../../index';
import MainView from './main-view';

global.$ = global.jQuery = Woowahan.$;

var app = new Woowahan();

app.start({
  url: '/', container: 'body', view: MainView
});
