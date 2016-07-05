import Woowahan from '../../../';
import Template from './todo-item.hbs';
import { COMPLETED_TODO, DELETE_TODO, EDIT_TODO } from '../action';

export default Woowahan.ItemView.create('TodoItem', {
  template: Template,
  events: {
    'click .toggle': 'toggleCompleted',
    'dblclick label': 'edit',
    'click .destroy': 'clear',
    '@keypress .edit': 'updateOnEnter(.edit)',
    '@keydown .edit': 'revertOnEscape(.edit)',
    'blur .edit': 'closeEdit'
  },

  myUpdate(todo) {
    this.dispatch(Woowahan.Event.create('toggle'));
    this.setModel(todo);
    this.updateView();
  },

  toggleCompleted() {
    this.setModel({ completed: !this.getModel('completed') });
    this.dispatch(Woowahan.Action.create(COMPLETED_TODO, this.getModel()), this.myUpdate);
  },

  edit() {
    this.$el.find('li').addClass('editing');
  },

  closeEdit() {
    this.$el.find('li').removeClass('editing');
  },

  clear() {
    this.dispatch(Woowahan.Action.create(DELETE_TODO, this.getModel()), this.remove);
  },

  revertOnEscape(value, event) {
    if (event.keyCode === 27) {
      let title = this.getModel('title');

      this.setModel({ title: value });
      this.setModel({ title });

      this.$el.find('li').removeClass('editing');
    }
  },

  updateOnEnter(value, event) {
    if (event.keyCode === 13) {
      this.setModel({ title: value });
      this.dispatch(Woowahan.Action.create(EDIT_TODO, this.getModel()), this.myUpdate);
    }
  }
});