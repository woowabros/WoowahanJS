import { FETCH_USERS } from '../action';
import { ReducerCreator } from '../core';

var Users = ReducerCreator(FETCH_USERS, function() {
  this.onSuccess = function(response) {
    this.finish(response);
  };

  this.get('/users');
});

export default Users;
