import Woowahan from '../../../index';
import Template from './content1.hbs';

export default Woowahan.View.create('ContentView1', {
  className: 'big',
  template: Template,

  events: {
    'click': 'onClick'
  },
  
  initialize() {
    this.setModel({
      text: 'init'
    });
    
    this.super();
  },

  viewWillMount: function(renderData) {
    renderData.text += ' & mount';
    
    return renderData;
  },

  viewDidMount: function(el) {
    el.find('p').css('color', 'red');
  },

  onClick() {
    alert('click');
  }
});