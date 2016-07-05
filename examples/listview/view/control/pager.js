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
    this.setModel(model);
    
    this.super();
  },
  
  viewDidMount($el) {
    var index = this.getModel('currentPage');
    
    $el.find('.pagination li').removeClass('active');
    $el.find('[data-page=' + index + ']').closest('li').addClass('active');
  },

  onPaging(event) {
    this.dispatch(Woowahan.Event.create('paging', +event.target.dataset.page));

    return false;
  }
});
