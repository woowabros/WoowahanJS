import Woowahan from '../../../index';
import Template from './sub-content2.hbs';

export default Woowahan.View.create('SubContentView2', {
  template: Template,

  events: {
    'click .btn-update': 'onClickUpdate'
  },

  onClickUpdate() {
    this.updateView();
  }
});