import Woowahan from '../../index';

export default Woowahan.View.create('Hello', {
  template: '<h1>Hello, WoowahanJs Plugin Example.</h1><ul data-role="bind" data-name="listData" data-type="list"></ul>',
  viewDidMount() {
    this.setModel({
      listData: [
        { label: 'test11', value: 'val11'},
        { label: 'test21', value: 'val21'},
        { label: 'test31', value: 'val31'},
        { label: 'test41', value: 'val41'},
        { label: 'test51', value: 'val51'},
        { label: 'test61', value: 'val61'}
      ]
    });
  }
});
