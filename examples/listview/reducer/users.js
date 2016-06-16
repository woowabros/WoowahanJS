import { FETCH_USERS } from '../action';
import { ReducerCreator } from '../core';

var Users = ReducerCreator(FETCH_USERS, function(options) {
  this.onSuccess = function(response) {
    this.finish(response);
  };

  this.getData(`/users?p=${options.page || 1}`);
});

export default Users;
