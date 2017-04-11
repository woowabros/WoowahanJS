import Woowahan from '../../../index';
import Template from './layout1.hbs';

export default Woowahan.View.create('LayoutView1', {
  template: Template,

  initialize() {
    console.log(this.getStates().test);
    this.setStates({ test: '1111' });

    this.super();
  },

  viewDidMount() {
    console.log(this.getStates('test'));
  }
});