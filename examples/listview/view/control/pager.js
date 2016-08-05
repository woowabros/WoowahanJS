import Woowahan from '../../../../index';
import Template from './pager.hbs';

export default Woowahan.View.create('Pager', {
  namespace: 'View:Control:Pager',
  tagName: 'nav',
  template: Template,
  
  events: {
    'click a[data-page]': 'onPaging'
  },

  initialize(model) {
    this.setModel(model);
    
    this.super();
  },

  viewWillMount(renderData) {
    const numOfRows = renderData.numOfRows;
    const currentPage = renderData.currentPage; // 10
    const total = renderData.total;

    const totalPage = Math.ceil(total / numOfRows);

    let start = parseInt((currentPage - 1) / 10) * 10;
    let count = Math.min(10, totalPage - start);

    renderData.prevPage = start - 9;
    renderData.nextPage = start + 11;

    const numbers = Array.from({ length: count }, () => {
      return { num: ++start, active: currentPage == start }
    });

    renderData.prev = currentPage > 10;
    renderData.numbers = numbers;
    renderData.next = count == 10;

    return renderData;
  },

  onPaging(event) {
    this.dispatch(Woowahan.Event.create('paging', +$(event.currentTarget).data('page')));

    return false;
  }
});
