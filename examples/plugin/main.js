import Woowahan from '../../index';
import HelloView from './hello-view';
import ListPlugin from './plugin/list';

global.$ = global.jQuery = Woowahan.$;

var app = new Woowahan();

app.use(Woowahan.Plugin.create('list', ListPlugin));

app.start({
  url: '/',
  container: '#content',
  view: HelloView
});