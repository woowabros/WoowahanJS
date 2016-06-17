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
    this.logStamp(this.model.toJSON());
    this.$el.html(Template(this.model.toJSON()));
    return this;
  },

  onPaging(event) {
    this.trigger('paging', +event.target.dataset.page);
    return false;
  },

  onUpdate(model) {

  }
});
