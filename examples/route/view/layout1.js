import Woowahan from '../../../index';
import Template from './layout1.hbs';

export default Woowahan.View.create('LayoutView1', {
  template: Template,

  viewWillMount(renderData) {
    renderData.links = this.getLinks(this.getRouteTables());

    debugger;

    return renderData;
  },

  getLinks(routeTables) {
    return Object.keys(routeTables).reduce((a, b) => (a[`${b}Link`] = `#${routeTables[b]()}`, a), {});
  }
});