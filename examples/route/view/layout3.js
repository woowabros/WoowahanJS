import Woowahan from '../../../index';
import Template from './layout3.hbs';

export default Woowahan.View.create('LayoutView3', {
  template: Template,

  initialize() {
    this.super();
  },

  viewDidMount() {
    console.log('viewDidMount');
  }
});