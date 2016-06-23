import Woowahan from '../../../../';
import { FETCH_USERS, FETCH_ONE_USER } from '../../action';
import Template from './index.hbs';
import User from './user';
import Pager from '../control/pager';

export default Woowahan.CollectionView.create('Users', {
  namespace: 'View:Users',
  tagName: 'div',
  template: Template,
  rowContainer: '.list > tbody',
  rowView: User,
  template: Template,

  events: {
    'click [data-action=refresh]': 'onRefresh',
    '@paging .pager-container': 'onPaging'
  },

  initialize() {
    this.super();

    this.setModel({
      prevPage: 0,
      currentPage: 1,
      nextPage: 2,
      numOfRows: 0
    });

    this.render();
    this.onRefresh();
  },

  // render() {
  //   this.$el.html(Template(this.model.toJSON()));
  //   return this;
  // },

  fetchUsers(data) {
    this.reload(data.resultSet);
    this.setModel({
      prevPage: data.page.page - 1,
      currentPage: data.page.page,
      nextPage: data.page.page + 1,
      numOfRows: data.resultSet.length
    });

    this.updateView('.pager-container', Pager, this.model);
  },

  fetchOneUser(data) {
    alert(data.name);
  },

  onSelectedRow(row) {
    this.dispatch(Woowahan.Action.create(FETCH_ONE_USER, { id: row.id, page: 1 }), this.fetchOneUser);
  },

  onRefresh() {
    this.dispatch(Woowahan.Action.create(FETCH_USERS), this.fetchUsers);
  },

  onPaging(page) {
    this.dispatch(Woowahan.Action.create(FETCH_USERS, { page: page }), this.fetchUsers);
  }
});