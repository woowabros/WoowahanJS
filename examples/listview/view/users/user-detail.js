import Woowahan from '../../../../index';

export default Woowahan.View.create('UserDetail', {
  template: '<p id="name"></p><p id="company"></p><button id="btn-back" class="btn btn-default">Back</button>',

  events: {
    'click #btn-back': 'onClickBack'
  },

  viewDidMount($el) {
    $el.find('#name').html(this.params.name || 'empty');
    $el.find('#company').html(this.query.company || 'empty');
  },

  onClickBack() {
    window.history.back();
  }
});
