import Woowahan from '../../../';
import Template from './content3.hbs';

export default Woowahan.View.create('ContentView3', {
  initialize() {
    this.super();
    this.render();
  },
  
  render() {
    this.$el.html(Template());
    
    return this;
  }
});