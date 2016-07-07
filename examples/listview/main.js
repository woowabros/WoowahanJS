import Woowahan from '../../';
import Users from './reducer/users';
import OneUser from './reducer/one-user';
import LayoutView from './view/layout';
import WelcomeView from './view/welcome';
import UsersView from './view/users';
import UserDetailView from './view/users/user-detail';

import 'bootstrap';

const app = new Woowahan();

app.use(Users);
app.use(OneUser);

app.use(Woowahan.Layout('#app', LayoutView));

app.start({
  url: '/',
  container: '.content',
  layout: 'LayoutView',
  view: WelcomeView,
  pages: [
    { url: '/users', view: UsersView },
    { url: '/users/:name', view: UserDetailView }
  ]
});
