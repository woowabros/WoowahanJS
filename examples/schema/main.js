import Woowahan from '../../';
import HelloView from './hello-view';

var app = new Woowahan();

var myTask = Woowahan.Reducer.create('my-task', function (data) {
  console.log('ok my task', data);
  this.finish();
});

var mySchema = Woowahan.Schema.create('hoho', {
  name:   Woowahan.Types.String({ required: true, max: 10 }),
  gender: Woowahan.Types.String({ required: true }),
  family: Woowahan.Types.Array(),
  age:    Woowahan.Types.Number({ min: 10, max: 100 })
});

mySchema.validate({
  name: '김민태',
  gender: '수석',
  age: 4
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
