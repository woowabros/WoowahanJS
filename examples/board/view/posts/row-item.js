import Template from './row-item.hbs';
import Woowahan from '../../../../index';


export default Woowahan.ItemView.create('RowItem', {
  tagName: 'tr',
  template: Template,
  onSelectedRow(event, trigger) {
    trigger({ id: this.getModel('id') });
  }
});
