import Woowahan from '../../../../index';
import Template from './popup-view.hbs';

export const PopupView = Woowahan.PopupView.create('PopupView', {
  template: Template,
  showOverlay: false,

  events: {
    'click button[data-ref=btnCancel]': 'onClickCancel',
    '@submit form[name=popup-form]': 'onSubmitForm'
  },

  viewDidMount($el) {
    $el.css({ width: 420, height: 80, overflow: 'hidden' });
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