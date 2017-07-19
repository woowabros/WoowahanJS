/*global _*/

import Woowahan from '../../index';
import HelloView from './hello-view';
import _ from 'underscore';

global.$ = global.jQuery = Woowahan.$;
global._ = _;

var app = new Woowahan();

var joinSchema = Woowahan.Schema.create('JoinSchema', {
  id:     Woowahan.Types.String({ required: true, min: 4, max: 20 }),
  name:   Woowahan.Types.String({ required: true, max: 30 }),
  email:  Woowahan.Types.Email({ required: true }),
  memo:   Woowahan.Types.String(),
  valid:  Woowahan.Types.Boolean({ required: true })
});

var myTask = Woowahan.Reducer.create('save-user-profile', joinSchema, function (data) {
  this.finish(data);
});

app.use(myTask);

app.on('error', errors => {
  alert(_(errors).map(o => o.message).join('\n'));
});

app.start({
  url: '',
  container: '#app',
  view: HelloView
});

