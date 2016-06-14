import Debug from 'debug';
import Router from './router';
import { CoreView, Application } from './core';
import Users from './reducer/users';

import 'bootstrap';

var application = new Application({
  reducers: [ Users ]
});

application.on('start', () => $('.loading').show());
application.on('finish', () => $('.loading').hide());

/* Enable debug log */
window.debug = Debug;
Debug.enable('*');

new Router();
