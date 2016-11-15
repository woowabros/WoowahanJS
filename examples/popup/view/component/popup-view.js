import Woowahan from '../../../../index';
import Template from './popup-view.hbs';

export const PopupView = Woowahan.View.create('PopupView', {
  template: Template,

  events: {
    'click button[data-ref=btnCancel]': 'onClickCancel',
    '@submit form[name=popup-form]': 'onSubmitForm'
  },

  onSubmitForm(data) {
    this.closePopup({ action: 'submit', data });

    return false;
  },

  onClickCancel() {
    this.closePopup();

    return false;
  }
});