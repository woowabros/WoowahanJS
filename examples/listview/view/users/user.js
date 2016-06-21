import Template from './user.hbs';
import Woowahan from '../../../../';

export default Woowahan.ItemView.create('User', {
  namespace: 'View:Users:User',
  tagName: 'tr',
  template: Template,

  initialize(data) {
    this.super();
    this.setModel(data);
    this.render();
  },

  render() {
    this.$el.html(this.template(this.getModel()));

    return this;
  },

  onSelectedRow(event, trigger) {
    trigger({ id: this.getModel('id') });
  }
});
