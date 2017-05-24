import Woowahan from '../../../index';
import Template from './layout2.hbs';

export default Woowahan.View.create('LayoutView2', {
  template: Template,

  initialize() {
    this.super();
  },

  viewWillMount(renderData) {
    renderData.links = this.getLinks(this.getRouteTables());

    return renderData;
  },

  getLinks(routeTables) {
    return Object.keys(routeTables).reduce((a, b) => (a[`${b}Link`] = `#${routeTables[b]()}`, a), {});
  }
});