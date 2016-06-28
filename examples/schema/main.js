import Woowahan from '../../';
import HelloView from './hello-view';

import 'bootstrap';

var app = new Woowahan();

var joinSchema = Woowahan.Schema.create('JoinSchema', {
  id:     Woowahan.Types.String({ required: true, min: 4, max: 20 }),
  name:   Woowahan.Types.String({ required: true, max: 30 }),
  email:  Woowahan.Types.String({ required: true }),
  memo:   Woowahan.Types.String()
});

var myTask = Woowahan.Reducer.create('my-task', joinSchema, function (data) {
  console.log('ok my task', data);
  this.finish();
});

app.use(myTask);

app.start({
  design: {
    url: '',
    container: '#app',
    view: HelloView
  }
});

woowahan.dispatch({ type: 'my-task'});
