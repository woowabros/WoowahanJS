import Woowahan from '../../../';
import Template from './todo-item.hbs';
import { COMPLETED_TODO } from '../action';

export default Woowahan.ItemView.create('TodoItem', {
  template: Template,
  events: {
    'click .toggle': 'toggleCompleted',
    'dblclick label': 'edit',
    'click .destroy': 'clear',
    'keypress .edit': 'updateOnEnter',
    'keydown .edit': 'revertOnEscape',
    'blur .edit': 'close'
  },

  myUpdate(todo) {
    this.dispatch(Woowahan.Event.create('toggle'));
    this.setModel(todo);
    this.updateView();
  },

  toggleCompleted() {
    this.dispatch(Woowahan.Action.create(COMPLETED_TODO, { id: this.getModel('id') }), this.myUpdate);
  }
});