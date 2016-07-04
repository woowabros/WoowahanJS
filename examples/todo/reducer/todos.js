import Woowahan from '../../../';
import { ALL_TODOS, NEW_TODO, COMPLETED_TODO, ALL_COMPLETED } from '../action';

const AllTodos = Woowahan.Reducer.create(ALL_TODOS, function() {
    this.finish(this.getStates().todos);
});

const NewTodo = Woowahan.Reducer.create(NEW_TODO, function(title) {
  this.getStates().todos.push({ id: this.getStates().todos.length + 1, title, completed: false });
  this.finish(this.getStates().todos);
});

const CompletedTodo = Woowahan.Reducer.create(COMPLETED_TODO, function(options) {
  let matchIndex = -1;

  this.getStates().todos.forEach((item, index) => {
    if (item.id === options.id) {
      matchIndex = index;
      item.completed = !item.completed;
    }
  });

  this.finish(this.getStates().todos[matchIndex]);
});

const AllCompleted = Woowahan.Reducer.create(ALL_COMPLETED, function(options) {
  this.getStates().todos.forEach(item => {
    if (!item.completed) {
      item.completed = true;
    }
  });

  this.finish(this.getStates().todos);
});

export {
  AllTodos,
  NewTodo,
  CompletedTodo,
  AllCompleted
};
