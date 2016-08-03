import Woowahan from '../../../index';
import { FETCH_USERS } from '../action';

var Users = Woowahan.Reducer.create(FETCH_USERS, function(options) {
  this.onSuccess = function(response) {
    this.finish(response);
  };

  this.getData(`/users?p=${options.page || 1}`);
});

export default Users;
