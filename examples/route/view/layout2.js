import Woowahan from '../../../index';
import Template from './layout2.hbs';

export default Woowahan.View.create('LayoutView2', {
  template: Template,

  initialize() {
    this.super();
  },

  viewWillMount(renderData) {
    const links = {};
    const routeTables = this.getRouteTables();

    for (const key in routeTables) {
      links[key] = routeTables[key]();
    }

    Object.assign(renderData, links);

    return renderData;
  },

  viewDidMount() {
    console.log('viewDidMount');
  }
});