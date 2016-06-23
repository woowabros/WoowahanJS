import Woowahan from '../../';
import HelloView from './hello-view';

var app = new Woowahan();

var myTask = Woowahan.Reducer.create('my-task', function (data) {
  console.log('ok my task', data);
  this.finish();
});

var mySchema = Woowahan.Schema.create('hoho', {
  name: Woowahan.Types.String({ required: true, max: 10 }),
  gender: Woowahan.Types.String({ required: true })
});

mySchema.validate({
  name: '김민태',
  title: '수석'
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
