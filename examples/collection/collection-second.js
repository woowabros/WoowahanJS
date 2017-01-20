import Woowahan from '../../index';

const RowItemView = Woowahan.CollectionView.create('RowItemView', {
  template: '<li></li>',

  viewDidMount($el) {
    $el.text(this.getModel('name'));
  }
});

const RowItemListView = Woowahan.CollectionView.create('RowItemListView', {
  template: '<ul class="rowItemContainer"></ul>',
  rowContainer: '.rowItemContainer',
  rowView: RowItemView,

  viewDidMount() {
    this.reload(this.getModel('list'));
  }
});

const RowView = Woowahan.ItemView.create('RowView', {
  template: '<li><span class="itemName"></span><div class="subItemContainer"></div></li>',

  viewDidMount($el) {
    const model = this.getModel();

    $el.find('.itemName').text(model.name);

    this.updateView('.subItemContainer', RowItemListView, { list: model.sub });
  }
});

export default Woowahan.CollectionView.create('CollectionViewSecond', {
  template: '<ul id="rowContainer"></ul>',
  rowContainer: '#rowContainer',
  rowView: RowView,

  viewDidMount() {
    this.reload(this.getModel('items'), { uid: 'name' });
  },

  viewWillUnmount() {
    this.reload();
  }
});