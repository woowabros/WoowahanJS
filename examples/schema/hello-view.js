import Woowahan from '../../index';
import Template from './schema.hbs';

export default Woowahan.View.create('Index', {
  className: 'container',
  template: Template,
  events: {
    '@submit form': 'onSave(#id, #name, #email)'
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

  onSave(id, name, email, inputs) {
    this.dispatch(Woowahan.Action.create('save-user-profile', {
      id: inputs['id'],
      name: inputs['name'],
      email: inputs['email']
    }), this.onCompleteSave);

    return false;
  },

  onCompleteSave(data) {
    alert('저장 완료');
  }
});