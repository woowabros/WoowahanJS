import Woowahan from '../../../../index';
import Template from '../templates/todo-item.hbs';
import * as KeyCode from '../helpers/keycode';
import {EDIT_TODO, COMPLETED_TODO, DELETE_TODO} from '../actions/index';

export default Woowahan.ItemView.create('TodoItem', {
  template: Template,
  events: {
    'dblclick label': 'edit',
    'blur .edit': 'closeEdit',
    '@keypress .edit': 'updateOnEnter(.edit)',
    '@keydown .edit': 'revertOnEscape(.edit)',
    'click .toggle': 'toggleCompleted',
    'click .destroy': 'clear',
  },
  selfUpdate(todo) {
    this.dispatch(Woowahan.Event.create('toggle'));
    this.setModel(todo);
    this.updateView();
  },
  edit() {
  	$(this.$el.get(0)).addClass('editing');
  },
  closeEdit() {
  	$(this.$el.get(0)).removeClass('editing');
  },
  updateOnEnter(value, event) {
  	if (event.keyCode === KeyCode.ENTER) {
  		this.setModel({ title: value });
    	this.dispatch(Woowahan.Action.create(EDIT_TODO, this.getModel()), this.selfUpdate);
  	}
  },
  revertOnEscape(value, event) {
    if (event.keyCode === KeyCode.ESC) {
      let title = this.getModel('title');
			this.setModel({ title });
      $(this.$el.get(0)).removeClass('editing');
    }
  },
  toggleCompleted() {
		this.setModel({ completed: !this.getModel('completed') });
    this.dispatch(Woowahan.Action.create(COMPLETED_TODO, this.getModel()), this.selfUpdate);
  },
  clear() {
    this.dispatch(Woowahan.Action.create(DELETE_TODO, this.getModel()), this.remove);
  },
  remove() {
  	$(this.$el.get(0)).remove();
  }
});