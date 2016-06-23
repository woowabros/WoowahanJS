import Woowahan from '../../../../';
import Template from './pager.hbs';

export default Woowahan.View.create('Pager', {
  namespace: 'View:Control:Pager',
  tagName: 'nav',
  template: Template,
  
  events: {
    'click [data-page]': 'onPaging'
  },

  initialize(model) {
    this.super();
    this.setModel(model);
  },

  onPaging(event) {
    this.trigger('paging', +event.target.dataset.page);
    return false;
  },

  onUpdate(model) {

  }
});
