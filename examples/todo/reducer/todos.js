import Woowahan from '../../../';
import Dexie from 'dexie';
import * as Action from '../action';
import TodoSchema from '../schema/todo';

var TodoDB = new Dexie('todos');

TodoDB.version(1).stores({
  todos: "++id,title,completed"
});

TodoDB.open();

const LoadTodos = Woowahan.Reducer.create(Action.LOAD_TODOS, function() {
  TodoDB.todos.toCollection().each(todo => {
    this.getStates().todos.push(todo);
  }).then(() => this.finish(this.getStates().todos));
});

const AllTodos = Woowahan.Reducer.create(Action.ALL_TODOS, function() {
  this.finish(this.getStates().todos);
});

const NewTodo = Woowahan.Reducer.create(Action.NEW_TODO, TodoSchema, function(todo) {
  todo.completed = false;
  
  TodoDB.todos.add(todo).then(id => {
    todo.id = id;
    
    this.getStates().todos.push(todo);
    this.finish(this.getStates().todos);
  });
});

const CompletedTodo = Woowahan.Reducer.create(Action.COMPLETED_TODO, function(todo) {
  let todos = this.getStates().todos;

  todos.forEach(item => {
    if (item.id === todo.id) item.completed = todo.completed;
  });

  TodoDB.todos.put(todo);
  this.finish(todo);
});

const AllCompleted = Woowahan.Reducer.create(Action.ALL_COMPLETED, function(options) {
  this.getStates().todos.forEach(item => {
    if (!item.completed) {
      item.completed = true;
    }
  });

  this.finish(this.getStates().todos);
});

const DeleteTodo = Woowahan.Reducer.create(Action.DELETE_TODO, function(todo) {
  let matchIndex = -1;
  let states = this.getStates();

  states.todos.forEach((item, index) => {
    if (item.id === todo.id) {
      matchIndex = index;
    }
  });

  TodoDB.todos.delete(states.todos[matchIndex].id);
  states.todos.splice(matchIndex, 1);
  this.finish();
});

const EditTodo = Woowahan.Reducer.create(Action.EDIT_TODO, function(todo) {
  let todos = this.getStates().todos;

  todos.forEach(item => {
    if (item.id === todo.id) item.title = todo.title;
  });

  TodoDB.todos.put(todo);
  this.finish(todo);
});

export {
  LoadTodos,
  AllTodos,
  NewTodo,
  CompletedTodo,
  AllCompleted,
  DeleteTodo,
  EditTodo
};
