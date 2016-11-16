import Woowahan from '../../../../index';
import Template from './base-view.hbs';
import { PopupView } from './popup-view';

/** TODO:
 * - 전체 팝업
 * - 부분 팝업
 *   => addPopup 메소드에서 처리
 *   => addPopup(PopupView, [container], callback)
 *
 *   - Dimed 유|무
 *   - Dimed 영역 선택시 팝업 제거|유지
 *   => PopupView에서 처리
 *   => 기본 설정을 가진 상태에서 옵션으로 스타일 등을 받는다.
 */

export const BaseView = Woowahan.View.create('BaseView', {
  template: Template,

  events: {
    'click button[data-ref=btnPopup]': 'onClickPopup'
  },

  onClickPopup() {
    this.refs.txtResult.innerText = '텍스트를 입력하세요.';

    this.addPopup(PopupView, function(popupData = {}) {
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