import Woowahan from '../../../../index';
import Template from './alert-view.hbs';

export const AlertView = Woowahan.PopupView.create('AlertView', {
  template: Template,

  events: {
    '@overlayClicked': 'onClickOverlay'
  },

  onClickOverlay() {
    this.closePopup();

    return false;
  }

});