import Woowahan from '../../../';
import Template from './layout2.hbs';

export default Woowahan.View.create('LayoutView2', {
  initialize() {
    this.super();
    this.render();
  },
  
  render() {
    this.$el.html(Template());
    
    return this;
  }
});