import Woowahan from '../../../';
import Template from './content2.hbs';

export default Woowahan.View.create('ContentView2', {
  initialize() {
    this.super();
    this.render();
  },
  
  render() {
    this.$el.html(Template());
    
    return this;
  }
});