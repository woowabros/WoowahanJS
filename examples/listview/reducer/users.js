import CoreReducer from './core-reducer';
import { FETCH_USERS } from '../action';

var Users = CoreReducer.create(FETCH_USERS, function(options) {
  this.onSuccess = function(response) {
    this.finish(response);
  };

  this.getData(`/users?p=${options.page || 1}`);
});

export default Users;
