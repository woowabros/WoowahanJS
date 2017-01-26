import Woowahan from '../../index';
import { MainLayout } from './view/layout/main-layout';
import { BaseView } from './view/component';

import Debug from 'debug';

global.$ = global.jQuery = Woowahan.$;

Debug.enable('*');

require("./sass/main.scss");
require('bootstrap-loader');

var app = new Woowahan();

app.use(Woowahan.Layout('#content', MainLayout));

app.start([
  { url: '/', container: '#mainContent', view: BaseView, layout: 'MainLayout' }
]);