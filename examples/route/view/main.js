import Woowahan from '../../../';
import Template from './main.hbs';

export default Woowahan.View.create('MainView', {
  initialize() {
    this.super();
    this.render();
  },
  
  render() {
    this.$el.html(Template());
    
    return this;
  }
});