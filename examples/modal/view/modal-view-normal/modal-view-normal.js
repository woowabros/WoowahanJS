import Woowahan from '../../../../index';
import Template from './modal-view-normal.hbs';

export default Woowahan.View.create('ModalViewNormal', {
  template: Template,

  events: {
    'click #btn-close': 'onClickClose',
    'click #btn-update': 'onUpdateCount'
  },

  initialize(data) {
    data.count = 0;

    this.setModel(data);

    this.super();
  },

  viewWillMount(renderData) {
    renderData.count = renderData.count + ' 번 업데이트';

    return renderData;
  },

  onUpdateCount() {
    this.dispatch(Woowahan.Event.create('updated', this.getModel('count')));
  },

  onClickClose() {
    this.dispatch(Woowahan.Event.create('closed'));
  }
});