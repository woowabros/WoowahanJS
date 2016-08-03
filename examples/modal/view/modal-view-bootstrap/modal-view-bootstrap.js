import Woowahan from '../../../../index';
import Template from './modal-view-bootstrap.hbs';

export default Woowahan.View.create('ModalViewBootstrap', {
  template: Template,

  events: {
    'click #tabs a': 'onClickTab'
  },

  initialize() {
    this.modal = null;

    this.super();
  },

  show() {
    if (!!this.modal) return;

    this.modal = this.$el.find('#myModal');

    this.modal.modal('show');

    this.modal.on('hidden.bs.modal', _.bind(this.onHideModal, this));
  },

  onClickTab(event) {
    $(event.currentTarget).tab('show');

    return false;
  },

  onHideModal() {
    if (!!this.modal) {
      this.modal.off('hidden.bs.modal', '**');

      this.modal = null;

      this.dispatch(Woowahan.Event.create('closed'));
    }
  }
});