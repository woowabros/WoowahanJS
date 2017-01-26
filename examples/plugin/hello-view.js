import Woowahan from '../../index';

export default Woowahan.View.create('Hello', {
  template: '<h1>Hello, WoowahanJs</h1><ul data-role="bind" data-name="listData" data-type="list"></ul>',

  initialize() {
    this.setModel({
      listData: [
        { label: 'test1', value: 'val1'},
        { label: 'test2', value: 'val2'},
        { label: 'test3', value: 'val3'},
        { label: 'test4', value: 'val4'},
        { label: 'test5', value: 'val5'},
        { label: 'test6', value: 'val6'}
      ]
    });

    this.super();
  }
});
