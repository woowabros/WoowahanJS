import Woowahan from '../../../index';
import Template from './main.hbs';

export default Woowahan.View.create('MainView', {
  template: Template,

  initialize() {
    this.super();
  }
});