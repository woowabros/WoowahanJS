import Woowahan from '../../../';
import Template from './layout.hbs';

export default Woowahan.View.create('LayoutView', {
  className: 'container',
  template: Template,

  initialize() {
    this.super();
  }

  // render() {
  //   this.$el.html(Template());
  //   return this;
  // }
});