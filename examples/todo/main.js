import Woowahan from '../../';
import TodoApp from './view/todo-app';
import { LOAD_TODOS } from './action';
import * as Reducers from './reducer/todos';

const app = new Woowahan();

app.use(Woowahan.Store.create({ todos: [] }));
app.use(Reducers);

app.dispatch(Woowahan.Action.create(LOAD_TODOS), () => {
  app.start({
    url: '*filter', container: '.todoapp', view: TodoApp
  });
});
