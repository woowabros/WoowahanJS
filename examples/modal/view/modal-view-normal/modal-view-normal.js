import Woowahan from '../../../../index';
import Template from './modal-view-normal.hbs';

export default Woowahan.View.create('ModalViewNormal', {
  template: Template,

  events: {
    'click #btn-close': 'onClickClose',
    'click #btn-update': 'onUpdateCount',
    'click .modal-overlay': 'onClickClose'
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

  viewDidMount() {
    setTimeout(function() {
      $('.modal-overlay, .modal-box').addClass('on');
    }, 300);
  },

  onUpdateCount() {
    const count = this.getModel('count');

    this.setModel({ count: count + 1 });
  },

  onClickClose() {
    this.dispatch(Woowahan.Event.create('closed'));
  }
});