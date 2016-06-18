import Woowahan from '../../../';
import { FETCH_ONE_USER } from '../action';

var OneUser = Woowahan.Reducer.create(FETCH_ONE_USER, function(options) {
  this.onSuccess = function(response) {
    this.finish(response);
  };

  this.getData('/users/'+options.id);
});

export default OneUser;
