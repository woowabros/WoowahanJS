import Woowahan from '../../../';
import Template from '../template/todo-app.hbs';
import TodoItem from './todo-item';
import TodoState from './todo-state';
import * as KeyCode from '../keycode';

import { ALL_TODOS, NEW_TODO, ALL_COMPLETED } from '../action/';

export default Woowahan.CollectionView.create('TodoApp', {
  template: Template,
  events: {
    '@keypress .new-todo': 'createOnEnter(.new-todo)',
    '@toggle': 'updateState',
    '@removetodo': 'updateState'
  },

  rowContainer: '.todo-list',
  rowView: TodoItem,

  initialize() {
    this.setModel({
      remaining: 0,
      filter: this.query.filter
    });

    this.dispatch(Woowahan.Action.create(ALL_TODOS), this.loadTodos);
    this.super();
  },

  updateFooterView() {
    this.updateView('.footer', TodoState, this.getModel());
  },

  viewDidMount() {
    this.updateFooterView();
  },

  loadTodos(todos) {
    let activeTodos = todos.filter(todo => !todo.completed);
    let completedTodos = todos.filter(todo => todo.completed);

    this.setModel({
      remaining: activeTodos.length
    });

    this.$el.find('.new-todo').val('');

    switch(this.query.filter) {
      case 'active':
        this.reload(activeTodos);
        break;
      case 'completed':
        this.reload(completedTodos);
        break;
      default:
        this.reload(todos);
    }

    this.updateFooterView();
  },

  updateState() {
    this.setModel({
      remaining: this.getStates().todos.filter(todo => !todo.completed).length
    });

    this.updateFooterView();
  },

  createOnEnter(value, event) {
    if (event.keyCode === KeyCode.ENTER) {
      this.dispatch(Woowahan.Action.create(NEW_TODO, value), this.loadTodos);
    }
  },

  toggleAllComplete() {
    this.dispatch(Woowahan.Action.create(ALL_COMPLETED), this.loadTodos);
  }
});