import CoreReducer from './core-reducer';
import { FETCH_ONE_USER } from '../action';

var OneUser = CoreReducer.create(FETCH_ONE_USER, function(options) {
  this.onSuccess = function(response) {
    this.finish(response);
  };

  this.getData('/users/' + options.id);
});

export default OneUser;
