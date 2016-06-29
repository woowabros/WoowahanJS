import Woowahan from '../../';

export default Woowahan.View.create('Index', {
  template: '<h1>Hello, WoowahanJS</h1><p id="count"></p><button id="btn-update">updateView self</button>',
  
  events: {
    'click #btn-update': 'onClickUpdate'
  },
  
  initialize() {
    this.setModel({ count: 0 });
    
    this.super();
  },
  
  viewWillMount(renderData) {
    console.log(renderData.count);
  },
  
  viewDidMount($el) {
    $el.find('h1').css('font-size', 50);
    
    $el.find('#count').text(this.getModel('count') + ' mount');
  },
  
  viewWillUnmount() {
    console.log('this view will unmount');
  },
  
  onClickUpdate() {
    let count = this.getModel('count');
    
    this.setModel({ count: ++count });
    this.updateView();
    
    return false;
  }
});