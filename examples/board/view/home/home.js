import Woowahan from '../../../../index';
import Template from './home.hbs';

export default Woowahan.View.create('HomeContentsView', {
  template: Template,

  initialize() {
    this.super();
  }
});
