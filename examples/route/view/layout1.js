import Woowahan from '../../../index';
import Template from './layout1.hbs';

export default Woowahan.View.create('LayoutView1', {
  template: Template,

  initialize() {
    this.super();
  }
});