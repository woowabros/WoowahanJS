import Woowahan from '../../index';

export default Woowahan.View.create('Hello', {
  template: `<h1>Hello, WoowahanJs</h1>
    <button id="btn-modal-normal">NORMAL</button>
    <button id="btn-modal-bootstrap">BOOTSTRAP</button>
    <div id="popup-wrap"></div>`,

  events: {
    'click #btn-modal-normal': 'onClickModalNormal',
    'click #btn-modal-bootstrap': 'onClickModalBootstrap',
    '@closed #popup-wrap': 'onCloseModal'
  },

  initialize() {
    this.modalNormal = null;
    this.modalBootstrap = null;

    this.super();
  },

  onClickModalNormal() {
    if (!!this.modalNormal) return;

    this.onCloseModal();

    const ModalViewNormal = this.getComponent('ModalComponentNormal');

    this.modalNormal = this.updateView('#popup-wrap', ModalViewNormal, { label: '팝업 컨테이너에 추가' });
  },

  onClickModalBootstrap() {
    if (!!this.modalBootstrap) return;

    this.onCloseModal();

    const ModalViewBootstrap = this.getComponent('ModalComponentBootstrap');

    this.modalBootstrap = this.updateView('#popup-wrap', ModalViewBootstrap);

    this.modalBootstrap.show();
  },

  onCloseModal() {
    if (!!this.modalNormal || !!this.modalBootstrap) {
      this.updateView('#popup-wrap');

      this.modalNormal = null;
      this.modalBootstrap = null;
    }
  }
});
