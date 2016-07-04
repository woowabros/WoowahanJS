import Woowahan from '../../../';
import Template from './todo-app.hbs';
import TodoItem from './todo-item';
import TodoState from './todo-state';

import { ALL_TODOS, NEW_TODO, ALL_COMPLETED } from '../action/';

export default Woowahan.CollectionView.create('TodoApp', {
  template: Template,
  events: {
    '@keypress .new-todo': 'createOnEnter(.new-todo)',
    '@toggle': 'updateState'
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

  viewDidMount() {
    this.updateView('.footer', TodoState, this.getModel());
  },

  loadTodos(todos) {
    let activeTodos = todos.filter(todo => !todo.completed);
    let completedTodos = todos.filter(todo => todo.completed);

    this.setModel({
      remaining: activeTodos.length
    });

    this.$el.find('.new-todo').val('');

    if (this.query.filter === 'active') this.reload(activeTodos);
    else if (this.query.filter === 'completed') this.reload(completedTodos);
    else this.reload(todos);

    this.updateView('.footer', TodoState, this.getModel());
  },

  updateState() {
    this.setModel({
      remaining: this.getStates().todos.filter(todo => !todo.completed).length
    });

    this.updateView('.footer', TodoState, this.getModel());
  },

  createOnEnter(value, event) {
    if (event.keyCode === 13) {
      this.dispatch(Woowahan.Action.create(NEW_TODO, value), this.loadTodos);
    }
  },

  toggleAllComplete() {
    this.dispatch(Woowahan.Action.create(ALL_COMPLETED), this.loadTodos);
  }
});