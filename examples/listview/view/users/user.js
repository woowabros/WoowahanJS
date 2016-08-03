import Template from './user.hbs';
import Woowahan from '../../../../index';

export default Woowahan.ItemView.create('User', {
  tagName: 'tr',
  template: Template,

  onSelectedRow(event, trigger) {
    trigger({ id: this.getModel('id') });
  }
});
