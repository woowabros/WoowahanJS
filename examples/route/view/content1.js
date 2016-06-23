import Woowahan from '../../../';
import Template from './content1.hbs';

export default Woowahan.View.create('ContentView1', {
  className: 'big',
  template: Template,
  model: {},

  events: {
    'click': 'onClick'
  },
  
  initialize() {
    this.super();

    this.model.text = 'init';
  },

  beforeMount: function(renderData) {
    renderData.text += ' & mount';
    
    return renderData;
  },

  afterMount: function(el) {
    console.log(el);

    el.find('p').css('color', 'red');
  },

  onClick() {
    alert('click');
  }
});