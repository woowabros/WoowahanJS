import Woowahan from '../../../';
import Template from './layout.hbs';

export default Woowahan.View.create('LayoutView', {
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