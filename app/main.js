import Debug from 'debug';
import Router from './router';
// import { Application } from './core';
import Users from './reducer/users';
import OneUser from './reducer/one-user';

import { Woowa } from '../';

import 'bootstrap';

const DEFAULT_SETTING = {
  reducers: [ Users, OneUser ],
  routers: [Router]
};

let woowa;

// use 1
woowa = new Woowa(DEFAULT_SETTING);

woowa.on('start', () => $('.loading').show());
woowa.on('finish', () => $('.loading').hide());

woowa.start();

// // use 2
// woowa = new Woowa;
// woowa.use(Users);
// woowa.use(OneUser);
// woowa.use(Router);
//
// woowa.on('start', () => $('.loading').show());
// woowa.on('finish', () => $('.loading').hide());
//
// woowa.start();