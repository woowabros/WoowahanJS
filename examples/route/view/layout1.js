import Woowahan from '../../../';
import Template from './layout1.hbs';

export default Woowahan.View.create('LayoutView1', {
  initialize() {
    this.super();
    this.render();
  },
  
  render() {
    this.$el.html(Template());
    
    return this;
  }
});