import Woowahan from 'woowahan';
import HelloView from './hello-view';

const app = new Woowahan();

app.start({
  url: '/',
  container: '#app',
  view: HelloView
});
