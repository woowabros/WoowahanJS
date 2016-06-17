import Woowahan from '../../../';
import Template from './layout.hbs';

export default Woowahan.View.create('LayoutView', {
  className: 'container',
  el: '.subview',

  initialize() {
    this.super();
    this.render();
  },

  render() {
    this.$el.html(Template());
  }
});