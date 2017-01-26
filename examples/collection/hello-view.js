import Woowahan from '../../index';
import HelloView from './hello-view.hbs';
import CollectionFirst from './collection-first';
import CollectionSecond from './collection-second';

export default Woowahan.View.create('Hello', {
  template: HelloView,

  firstItems: [
    { name: 'firstItem0' },
    { name: 'firstItem1' },
    { name: 'firstItem2' },
    { name: 'firstItem3' },
    { name: 'firstItem4' }
  ],

  secondItems: [
    { name: 'secondItem0', sub: [{ name: 'secondSubItem' }] },
    { name: 'secondItem1', sub: [{ name: 'secondSubItem' }] },
    { name: 'secondItem2', sub: [{ name: 'secondSubItem' }] },
    { name: 'secondItem3', sub: [{ name: 'secondSubItem' }] },
    { name: 'secondItem4', sub: [{ name: 'secondSubItem' }] },
  ],

  events: {
    'click #btnUpdateFirst': 'onClickUpdateFirst',
    'click #btnUpdateSecond': 'onClickUpdateSecond'
  },

  viewDidMount() {
    this.collectionFirst = this.updateView(this.refs.collectionFirst, CollectionFirst, { items: this.firstItems });
    this.collectionSecond = this.updateView(this.refs.collectionSecond, CollectionSecond, { items: this.secondItems });
  },

  onClickUpdateFirst() {
    this.firstItems = this.collectionFirst.getCollection();
    this.firstItems.push({ name: `firstItem${this.firstItems.length}` });

    this.updateView(this.refs.collectionFirst, CollectionFirst, { items: this.firstItems });
  },

  onClickUpdateSecond() {
    this.secondItems = this.collectionSecond.getCollection();
    this.secondItems.push({ name: `secondItem${this.secondItems.length}`, sub: [{ name: 'secondSubItem' }] });

    this.updateView(this.refs.collectionSecond, CollectionSecond, { items: this.secondItems });
  }
});
