import Woowahan from '../../../../';
import Template from './pager.hbs';

export default Woowahan.View.create('Pager', {
  namespace: 'View:Control:Pager',
  tagName: 'nav',
  
  events: {
    'click [data-page]': 'onPaging'
  },

  initialize(model) {
    this.super();
    this.setModel(model);
    this.render();
  },

  render() {
    this.logStamp(this.getModel());
    this.$el.html(Template(this.getModel()));
    return this;
  },

  onPaging(event) {
    this.trigger('paging', +event.target.dataset.page);
    return false;
  },

  onUpdate(model) {

  }
});
