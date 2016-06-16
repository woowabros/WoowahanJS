import Router from './router';
import Users from './reducer/users';
import OneUser from './reducer/one-user';

import { Woowahan } from '../';

import 'bootstrap';

const DEFAULT_SETTING = {
  reducers: [ Users, OneUser ],
  routers: [Router]
};

let woowa;

// use 1
woowa = new Woowahan(DEFAULT_SETTING);

woowa.on('start', () => $('.loading').show());
woowa.on('finish', () => $('.loading').hide());

woowa.start();

// // use 2
// woowa = new Woowahan;
// woowa.use(Users);
// woowa.use(OneUser);
// woowa.use(Router);
//
// woowa.on('start', () => $('.loading').show());
// woowa.on('finish', () => $('.loading').hide());
//
// woowa.start();