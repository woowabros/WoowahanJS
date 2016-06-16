import { FETCH_ONE_USER } from '../action';
import { ReducerCreator } from '../core';

var OneUser = ReducerCreator(FETCH_ONE_USER, function(options) {
  this.onSuccess = function(response) {
    this.finish(response);
  };

  this.getData('/users/'+options.id);
});

export default OneUser;
