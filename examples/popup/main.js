import Woowahan from '../../index';
import { MainLayout } from './view/layout/main-layout';
import { BaseView, PopupView } from './view/component';

import Debug from 'debug';

global.$ = global.jQuery = Woowahan.$;

Debug.enable('*');

var app = new Woowahan();

app.use(Woowahan.Layout('#content', MainLayout));
app.use(Woowahan.Popup('PopupView', PopupView));

app.start([
  { url: '/', container: '#mainContent', view: BaseView, layout: 'MainLayout' }
]);