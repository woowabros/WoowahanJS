import Woowahan from '../../../';
import Template from './content1.hbs';

export default Woowahan.View.create('ContentView1', {
  initialize() {
    this.super();
    this.render();
  },
  
  render() {
    this.$el.html(Template());
    
    return this;
  }
});