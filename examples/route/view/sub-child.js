import Woowahan from '../../../index';

export default Woowahan.View.create('ChildView', {
  template: `<p>Sub Child View</p><button id="btn-test">TEST</button>`,

  events: {
    'click #btn-test': 'onClickTest'
  },

  viewDidMount() {
    console.log('did mount');
  },

  onClickTest() {
    console.log('click test');
  }
});