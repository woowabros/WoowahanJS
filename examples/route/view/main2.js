import Woowahan from '../../../';
import Template from './main2.hbs';

export default Woowahan.View.create('MainView2', {
  initialize() {
    this.super();
    this.render();
  },
  
  render() {
    this.$el.html(Template());
    
    return this;
  }
});