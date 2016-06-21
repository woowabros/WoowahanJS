import Woowahan from '../../../';
import Template from './layout3.hbs';

export default Woowahan.View.create('LayoutView3', {
  initialize() {
    this.super();
    this.render();
  },
  
  render() {
    this.$el.html(Template());
    
    return this;
  }
});