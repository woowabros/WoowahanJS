import Woowahan from '../../../index';
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
      filter: this.params.filter
    });

    this.super();
  },

  updateFooterView() {
    this.updateView('.footer', TodoState, this.getModel());
  },

  viewDidMount() {
    this.dispatch(Woowahan.Action.create(ALL_TODOS), this.loadTodos);
  },

  loadTodos(todos) {
    let activeTodos = todos.filter(todo => !todo.completed);
    let completedTodos = todos.filter(todo => todo.completed);
    let filter = this.params.filter;

    this.setModel({
      remaining: activeTodos.length,
      filter: filter
    });

    this.$el.find('.new-todo').val('');

    switch(filter) {
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

  createOnEnter(title, event) {
    if (event.keyCode === KeyCode.ENTER) {
      this.dispatch(Woowahan.Action.create(NEW_TODO, { title }), this.loadTodos);
    }
  },

  toggleAllComplete() {
    this.dispatch(Woowahan.Action.create(ALL_COMPLETED), this.loadTodos);
  }
});