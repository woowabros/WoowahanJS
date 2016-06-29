import Template from './user.hbs';
import Woowahan from '../../../../';

export default Woowahan.ItemView.create('User', {
  namespace: 'View:Users:User',
  tagName: 'tr',
  template: Template,

  initialize(data) {
    this.setModel(data);
    
    this.super();
  },
  
  viewWillUnmount() {
    console.log(this.getModel());
  },

  onSelectedRow(event, trigger) {
    trigger({ id: this.getModel('id') });
  }
});
