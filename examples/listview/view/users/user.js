import Template from './user.hbs';
import Woowahan from '../../../../';

export default Woowahan.ItemView.create('User', {
  namespace: 'View:Users:User',
  tagName: 'tr',
  template: Template,

  initialize(data) {
    this.super();
    this.setModel(data);
  },

  onSelectedRow(event, trigger) {
    trigger({ id: this.getModel('id') });
  }
});
