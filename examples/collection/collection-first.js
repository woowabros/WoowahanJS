import Woowahan from '../../index';

const RowView = Woowahan.ItemView.create('RowView', {
  template: '<li></li>',

  viewDidMount($el) {
    $el.text(this.getModel('name'));
  }
});

export default Woowahan.CollectionView.create('CollectionViewFirst', {
  template: '<ul id="rowContainer1"></ul>',
  rowContainer: '#rowContainer1',
  rowView: RowView,

  viewDidMount() {
    this.reload(this.getModel('items'), { uid: 'name' });
  },

  viewWillUnmount() {
    this.reload();
  }
});