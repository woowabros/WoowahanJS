import Woowahan from '../../';
// import Users from './reducer/users';
// import OneUser from './reducer/one-user';
import LayoutView from './view/layout';
// import UsersView from './view/users';

import 'bootstrap';

var app = new Woowahan();
//
// app.use(Users);
// app.use(OneUser);

/*
app.start({
  design: {
    url: '',
    container: '#app',
    view: LayoutView,
    pages: [
      {
        url: '/users',
        container: '.content',
        view: UsersView
      }
    ]
  }
});
*/
app.start({
  design: {
    url: '',
    container: '#app',
    view: LayoutView
  }
});