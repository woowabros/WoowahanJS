import Woowahan from '../../';

const woowahan = new Woowahan;

const View = Woowahan.View.create({
  initialize(className) {
    this.className = className;
  },

  render() {
    this.$el.html(`<div class="${this.className}"></div>`);

    return this;
  }
});

const router = Woowahan.Router.create({
  namespace: 'Router',
  container: '.content',

  routes: {
    '': 'onWelcome',
    'red': 'onRed',
    'blue': 'onBlue'
  },

  initialize() {
    this.super();
  },

  onWelcome() {
    this.addView(new View('white'));
  },

  onRed() {
    this.addView(new View('red'));
  },

  onBlue() {
    this.addView(new View('blue'));
  },

  before() {
    this.logStamp('start route');

    this.clearView();
  },

  after() {
    this.logStamp('end route');
  }
});

woowahan.use(router);

woowahan.start();