import Woowahan from '../../index';

export default Woowahan.View.create('Hello', {
  events: {
    'click #btn-hello': 'onClickHello',
    'click #btn-woowahan': 'onClickWoowahan'
  },

  viewWillMount() {
    console.log('will mount');
  },

  viewDidMount() {
    console.log('did mount');
  },

  onClickHello() {
    alert('hello');
  },

  onClickWoowahan() {
    alert('woowahan');
  }
});
