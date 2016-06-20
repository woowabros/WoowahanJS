import Woowahan from '../../../';
import Template from './welcome.hbs';

export default Woowahan.View.create('WelcomeView', {
  className: 'container',

  initialize() {
    this.super();
    this.render();
  },

  render() {
    this.$el.html(Template());
    return this;
  }
});