import Woowahan from '../../';
import Users from './reducer/users';
import OneUser from './reducer/one-user';
import LayoutView from './view/layout';
import WelcomeView from './view/welcome';
import UsersView from './view/users';

import 'bootstrap';

const UserView = Woowahan.View.create('UserView', {
  template: '<p id="name"></p><button id="btn-back">Back</button>',
  
  events: {
    'click #btn-back': 'onClickBack'
  },
  
  viewDidMount($el) {
    $el.find('#name').html(this.query.name || 'empty');
  },
  
  onClickBack() {
    window.history.back();
  }
});

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
    {
      url: '/users',
      container: '.content',
      view: UsersView
    },
    {
      url: '/user/:name',
      container: '.content',
      view: UserView
    }
  ]
});
