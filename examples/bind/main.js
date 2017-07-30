import Woowahan from '../../index';
import HelloView from './hello-view';
import { TextDecoPlugin } from './plugin';

global.$ = global.jQuery = Woowahan.$;

var app = new Woowahan();

app.use(Woowahan.Plugin('deco', TextDecoPlugin));

app.start({
  url: '/',
  container: '#content',
  view: HelloView
});