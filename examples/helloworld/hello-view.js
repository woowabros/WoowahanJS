import Woowahan from '../../';

export default Woowahan.View.create('Index', {
  template: '<h1>Hello, WoowahanJS</h1>',
  
  initialize() {
    this.super();
  },
  
  viewWillMount(renderData) {
    console.log('viewWillMount');
  },
  
  viewDidMount($el) {
    $el.css('font-size', 50);
  }
});