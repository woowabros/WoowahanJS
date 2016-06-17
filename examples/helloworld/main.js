import Woowahan from '../../';
import HelloView from './hello-view';

var app = new Woowahan();

app.start({
  design: {
    url: '',
    container: '#app',
    view: HelloView
  }
});
