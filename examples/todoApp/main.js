import Woowahan from '../../index';
import * as TodoReducers from './src/reducers/todos'
import TodoApp from './src/views/todo-app';
import { LOAD_TODOS } from './src/actions';

global.$ = global.jQuery = Woowahan.$;

const app = new Woowahan();

app.use(Woowahan.Store.create({ todos: [] }));
app.use(TodoReducers);

app.dispatch(Woowahan.Action.create(LOAD_TODOS), () => {
	app.start({
	  url: '*filter', container: '.todoapp', view: TodoApp
	});	
})
