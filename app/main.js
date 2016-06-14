import Debug from 'debug';
import Router from './router';
import { Application } from './core';
import Users from './reducer/users';
import OneUser from './reducer/one-user';

import 'bootstrap';

var application = new Application({
  reducers: [ Users, OneUser ]
});

application.on('start', () => $('.loading').show());
application.on('finish', () => $('.loading').hide());

/* Enable debug log */
window.debug = Debug;
Debug.enable('*');

new Router();
