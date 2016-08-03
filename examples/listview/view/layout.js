import Woowahan from '../../../index';
import Template from './layout.hbs';

export default Woowahan.View.create('LayoutView', {
  className: 'container',
  template: Template,

  initialize() {
    this.super();
  }
});