import Woowahan from '../../../../index';
import Template from './index.hbs';
import RowItem from './row-item';

import Pager from '../helpers/pager/pager';

import { FETCH_POSTS } from '../../action';

export default Woowahan.CollectionView.create('Posts', {
  rowContainer: '.list > tbody',
  rowView: RowItem,
  template: Template,
  events: {
    '@paging': 'onPagingHandler'
  },
  initialize() {
    this.setModel({
      currentPage: 1,
      total: 0,
      numOfRows: 10
    });
    this.super();
  },
  viewDidMount() {
    this.dispatch(Woowahan.Action.create(FETCH_POSTS), this.fetchPosts);
  },
  fetchPosts(data) {
    this.reload(data.payload);
    this.setModel({
      total: data.total
    });
    this.updateView(this.refs.pager, Pager, this.model);
  },
  onSelectedRow(row) {
    window.location.hash = '#/posts/' + row.id
  },
  onPagingHandler(page) {
    this.setModel({
      currentPage: page
    });
    this.dispatch(Woowahan.Action.create(FETCH_POSTS, { page: page }), this.fetchPosts);
  }
})
