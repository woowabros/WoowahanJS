import Woowahan from '../../../';
import Template from './welcome.hbs';

export default Woowahan.View.create('WelcomeView', {
  className: 'container',
  template: Template,

  initialize() {
    this.super();
  }
});