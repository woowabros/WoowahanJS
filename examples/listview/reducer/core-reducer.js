import Woowahan from '../../../index';

export default Woowahan.Reducer.extend({
  onFail(jqXHR, textStatus, message) {
    console.log(`${this.actionName}:: [${textStatus}] ${message}!`);
  }
});
