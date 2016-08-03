import Woowahan from '../../index';

export default Woowahan.View.create('Hello', {
  template: `<h1>Hello, WoowahanJs</h1>
    <button id="btn-modal-normal">NORMAL</button>
    <button id="btn-modal-bootstrap">BOOTSTRAP</button>
    <div id="popup-wrap"></div>`,

  events: {
    'click #btn-modal-normal': 'onClickModalNormal',
    'click #btn-modal-bootstrap': 'onClickModalBootstrap'
  },

  onClickModalNormal() {
    const ModalViewNormal = this.getComponent('ModalComponentNormal');

    this.updateView('#popup-wrap', ModalViewNormal, { label: '팝업 컨테이너에 추가' });
  },

  onClickModalBootstrap() {
    const ModalViewBootstrap = this.getComponent('ModalComponentBootstrap');

    const modalView = this.updateView('#popup-wrap', ModalViewBootstrap);

    modalView.show();
  }
});
