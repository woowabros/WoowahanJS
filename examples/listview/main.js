import Woowahan from '../../';
import Users from './reducer/users';
import OneUser from './reducer/one-user';
import LayoutView from './view/layout';
import WelcomeView from './view/welcome';
import UsersView from './view/users';

import 'bootstrap';

var app = new Woowahan();

app.use(Users);
app.use(OneUser);

app.start({
  layout: {
    view: LayoutView
  },
  design: {
    url: '/',
    container: '#app',
    view: WelcomeView,
    pages: [
      {
        url: 'users',
        container: '.content',
        view: UsersView
      }
    ]
  }
});
