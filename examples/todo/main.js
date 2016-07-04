import Woowahan from '../../';
import TodoApp from './view/todo-app';
import { AllTodos, NewTodo, CompletedTodo, AllCompleted } from './reducer/todos';

const app = new Woowahan();
const store = Woowahan.Store.create({ todos: [] });

app.use(store);
app.use([AllTodos, NewTodo, CompletedTodo, AllCompleted]);

app.start({
  url: '*filter', container: '.todoapp', view: TodoApp
});
