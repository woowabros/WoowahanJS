import Woowahan from '../../../../index';

export default Woowahan.View.create('UserDetail', {
  template: '<p id="name"></p><button id="btn-back" class="btn btn-default">Back</button>',

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
