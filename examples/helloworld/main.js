import Woowahan from '../../index';
import HelloView from './hello-view';

var app = new Woowahan();

app.start({
  url: '/',
  container: '#content',
  view: HelloView
});