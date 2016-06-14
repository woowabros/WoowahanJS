import Backbone from 'Backbone';
import { CoreRouter } from './core';
import Layout from './view/layout';
import Welcome from './view/welcome';
import Users from './view/users';

export default CoreRouter.extend({
  namespace: 'Router',
  container: '.content',

  routes: {
    '': 'onWelcome',
    'users': 'onUsers'
  },

  initialize() {
    CoreRouter.prototype.initialize.apply(this, arguments);

    var layout = new Layout();

    $('#app').append(layout.$el);

    Backbone.history.start();
  },

  before() {
    this.logStamp('start route');
    this.clearView();
  },

  after() {
    this.logStamp('end route');
  },

  onWelcome() {
    this.addView(new Welcome);
  },

  onUsers() {
    this.addView(new Users);
  }
});
