import Woowahan from '../../index';
import HelloView from './hello-view';
import ModalViewNormal from './view/modal-view-normal/modal-view-normal';
import ModalViewBootstrap from './view/modal-view-bootstrap/modal-view-bootstrap'

require("./sass/main.scss");
require('bootstrap-loader');

global.$ = global.jQuery = Woowahan.$;

var app = new Woowahan();

app.use(Woowahan.Component('ModalComponentNormal', ModalViewNormal));
app.use(Woowahan.Component('ModalComponentBootstrap', ModalViewBootstrap));

app.start({
  url: '/',
  container: '#content',
  view: HelloView
});
