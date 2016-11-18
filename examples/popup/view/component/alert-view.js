import Woowahan from '../../../../index';
import Template from './alert-view.hbs';

export const AlertView = Woowahan.PopupView.create('AlertView', {
  template: Template,

  events: {
    'click button[data-ref=btnClose]': 'onClickClose',

    '@overlayClicked': 'onClickOverlay'
  },

  onClickOverlay() {
    this.closePopup();

    return false;
  },

  onClickClose() {
    this.closePopup();

    return false;
  }
});