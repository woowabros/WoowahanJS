import Woowahan from '../../../../index';
import { FETCH_USERS, FETCH_ONE_USER } from '../../action';
import Template from './index.hbs';
import User from './user';
import Pager from '../control/pager';

export default Woowahan.CollectionView.create('Users', {
  rowContainer: '.list > tbody',
  rowView: User,
  template: Template,

  events: {
    'click [data-action=refresh]': 'onRefresh',
    '@paging .pager-container': 'onPaging'
  },

  initialize() {
    this.setModel({
      currentPage: 1,
      total: 0,
      numOfRows: 0
    });
    
    this.super();
  },

  viewDidMount() {
    this.dispatch(Woowahan.Action.create(FETCH_USERS), this.fetchUsers);
  },

  fetchUsers(data) {
    this.reload(data.resultSet, { uid: 'id', reset: false });
    
    this.setModel({
      currentPage: data.page.page,
      total: data.page.total,
      numOfRows: data.resultSet.length
    });

    this.updateView('.pager-container', Pager, this.model);
  },

  fetchOneUser(data) {
    window.location.hash = this.getRouteTables('UserDetailView', { name: data.name }, `company=${data.company}`);
  },

  onSelectedRow(row) {
    this.dispatch(Woowahan.Action.create(FETCH_ONE_USER, { id: row.id, page: 1 }), this.fetchOneUser);
  },

  onRefresh() {
    this.updateView();
    
    return false;
  },

  onPaging(page) {
    this.dispatch(Woowahan.Action.create(FETCH_USERS, { page: page }), this.fetchUsers);
  }
});