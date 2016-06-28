import Woowahan from '../../';
import Template from './schema.hbs';

export default Woowahan.View.create('Index', {
  className: 'container',
  template: Template,
  events: {
    'submit form': 'onSave'
  },

  render() {
    this.$el.html(Template());
    return this;
  },

  onSave() {
    let id = this.$el.find('#id').val();
    let name = this.$el.find('#name').val();
    let email = this.$el.find('#email').val();

    console.log({ id, name, email });

    this.dispatch(Woowahan.Action.create('my-task', { id, name, email }), this.onCompleteSave)
    return false;
  },

  onCompleteSave(data) {
    console.log('complete');
  }
});