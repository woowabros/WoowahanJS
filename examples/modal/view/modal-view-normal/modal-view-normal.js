import Woowahan from '../../../../index';
import Template from './modal-view-normal.hbs';

export default Woowahan.View.create('ModalViewNormal', {
  template: Template,

  events: {
    'click #btn-close': 'onClickClose'
  },

  initialize(data) {
    this.setModel(data);

    this.super();
  },

  onClickClose() {
    this.dispatch(Woowahan.Event.create('closed'));
  }
});