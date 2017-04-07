import Woowahan from '../../../index';
import HelloView from './hello-view';

const app = new Woowahan();

app.start({
  url: '/',
  container: '#app',
  view: HelloView
});
