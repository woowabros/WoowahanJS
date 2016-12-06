import Woowahan from '../../../../index';
import Template from './popup-view.hbs';
import { AlertView } from './alert-view';

export const PopupView = Woowahan.PopupView.create('PopupView', {
  template: Template,

  events: {
    'click button[data-ref=btnCancel]': 'onClickCancel',
    '@submit form[name=popup-form]': 'onSubmitForm'
  },

  initialize() {
    this.super();
  },

  viewDidMount($el) {
    $el.css({ width: 420, height: 80, overflow: 'hidden' });
  },

  onSubmitForm(data) {
    if (!data.txt0 || !data.txt1 || !data.txt2) {
      this.addPopup(AlertView, {
        css: {
          width: '300px', height: '200px'
        },
        title: '경고',
        desc: '입력해주세요.',
        buttons: {
          'button[data-ref=btnClose]': function() {
            this.closePopup();

            return false;
          }
        }
      });

      return false;
    }

    this.closePopup({ action: 'submit', data });

    return false;
  },

  onClickCancel() {
    this.closePopup();

    return false;
  },

  onOverlayClick(event) {
    console.log(event);
  }
});