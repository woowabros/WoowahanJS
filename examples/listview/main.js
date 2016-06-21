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

console.log(Woowahan.Types.String());
console.log(Woowahan.Types.Array({ required: true }));
console.log(Woowahan.Types.Number({ min: 0, max: 100 }));

app.start({
  layout: {
    container: '#app',
    view: LayoutView
  },
  design: {
    url: '/',
    container: '.content',
    view: WelcomeView,
    pages: [
      {
        url: '/users',
        container: '.content',
        view: UsersView
      }
    ]
  }
});
