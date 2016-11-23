import Woowahan from '../../../../index';
import Template from './base-view.hbs';
import { PopupView } from './popup-view';

export const BaseView = Woowahan.View.create('BaseView', {
  template: Template,

  events: {
    'click button[data-ref=btnPopup]': 'onClickPopup'
  },

  onClickPopup() {
    this.refs.txtResult.innerText = '텍스트를 입력하세요.';

    this.addPopup(PopupView, { title: '입력해 주세요.' }, function(popupData = {}) {
      if (popupData.action === 'submit') {
        const data = popupData.data;
        const result = Object.keys(data).reduce((prev, key) => ((!!data[key] ? prev.push(data[key]) : prev), prev), []);

        if (!!result.length) {
          this.refs.txtResult.innerText = `입력된 결과는 ${result.join(', ')}입니다.`;
        } else {
          this.refs.txtResult.innerText = '입력된 텍스트가 없습니다.';
        }
      } else {
        this.refs.txtResult.innerText = '입력이 취소되었습니다.';
      }
    });
  }
});