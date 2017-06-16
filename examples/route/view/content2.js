import Woowahan from '../../../index';
import Template from './content2.hbs';
import { DISPATCH_ACTION } from '../action';

export default Woowahan.View.create('ContentView2', {
  template: Template,

  events: {
    'click .btn-dispatch': 'onClickDispatch'
  },

  onClickDispatch() {
    this.dispatch(Woowahan.Action.create(DISPATCH_ACTION), function(data) {
      console.log(data);
    });
  }
});