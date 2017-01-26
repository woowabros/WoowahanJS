import Woowahan from '../../../../index';
import Template from '../templates/todo-app.hbs';
import TodoItem from './todo-item';
import TodoState from './todo-state';

import * as KeyCode from '../helpers/keycode';
import {LOAD_TODOS, NEW_TODO, ALL_TODOS, ALL_COMPLETED, CLEAR_COMPLETED_TODO} from '../actions/index';

export default Woowahan.CollectionView.create('TodoApp', {
  rowContainer: '.todo-list',
  rowView: TodoItem,
  template: Template,
  events: {
    'click .toggle-all': 'toggleAllComplete',
  	'@keypress .new-todo': 'createOnEnter(.new-todo)',
    '@toggle': 'updateState',
    '@click .clear-completed': 'clearCompleted'
  },
  initialize() {
    this.setModel({
      remaining: 0,
      filter: this.params.filter
    });

    this.super();
  },
  viewDidMount() {
    this.dispatch(Woowahan.Action.create(ALL_TODOS), this.loadTodos);
  },
  createOnEnter(title, event) {
  	if (event.keyCode === KeyCode.ENTER) {
  		this.dispatch(Woowahan.Action.create(NEW_TODO, { title }), this.loadTodos);
    }
  },
  updateState() {
    this.setModel({
      remaining: this.getStates().todos.filter(todo => !todo.completed).length
    });

    this.updateFooterView();
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
  updateFooterView() {
    this.updateView(this.refs.footer, TodoState, this.getModel());
  },
  toggleAllComplete() {
    this.dispatch(Woowahan.Action.create(ALL_COMPLETED), this.loadTodos);
  },
  clearCompleted() {
    this.dispatch(Woowahan.Action.create(CLEAR_COMPLETED_TODO, this.getModel()), this.loadTodos);
  }
});