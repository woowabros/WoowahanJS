import Woowahan from '../../';

export default Woowahan.View.create('Index', {
  template: '<h1>Hello, WoowahanJS</h1>',
  
  initialize() {
    this.super();
  },
  
  beforeMount(renderData) {
    
  },
  
  afterMount($el) {
    $el.css('font-size', 50);
  }
});