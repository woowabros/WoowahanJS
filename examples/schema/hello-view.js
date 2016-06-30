import Woowahan from '../../';
import Template from './schema.hbs';

export default Woowahan.View.create('Index', {
  className: 'container',
  template: Template,
  events: {
    'submit form': 'onSave'
  },

  initialize() {
    this.super();
  },

  viewWillMount(renderData) {
    this.log('will mount');
    return Object.assign({}, renderData);
  },

  viewDidMount($el) {
    this.log('did mount');
  },

  onSave() {
    let id = this.$el.find('#id').val();
    let name = this.$el.find('#name').val();
    let email = this.$el.find('#email').val();

    this.dispatch(Woowahan.Action.create('save-user-profile', { id, name, email }), this.onCompleteSave);
    return false;
  },

  onCompleteSave(data) {
    alert('저장 완료');
  }
});