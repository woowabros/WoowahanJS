import Woowahan from '../../../index';
import Template from './main1.hbs';

export default Woowahan.View.create('MainView1', {
  template: Template,

  initialize() {
    this.setModel({ src: 'efeeefe' });

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