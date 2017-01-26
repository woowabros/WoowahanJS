import Woowahan from '../../../index';
import { FETCH_POSTS } from '../action';

export default Woowahan.Reducer.create(FETCH_POSTS, function(options) {
  this.onSuccess = function(response) {
		let currentPage = options.page || 1;
		let numOfRows = 10;
		let copyData = response.slice( (currentPage-1) * numOfRows , currentPage * numOfRows)
    let returnData = {
  		currentPage: currentPage,
      total: response.length,
      numOfRows: 10,
      payload: copyData		
  	};
  	this.finish(returnData);
  };

  this.getData(`https://jsonplaceholder.typicode.com/posts`);
});


