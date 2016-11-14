import Woowahan from '../../index';
import Template from './hello-view.hbs';

const sampleData = {
  'korean': ['맛집', '산들애 송파점', '본가 한식 전문'],
  'chinese': ['일공중식', '청 한남점', '태가원'],
  'western': [{ label: 'LA 청국장', value: 'la' }, { label: '뉴욕 비지찌개', value: 'ny', selected: true }],
  'etc': '없음'
};

export default Woowahan.View.create('Hello', {
  template: Template,

  events: {
    '@change #sel-depth1': 'onChangeDepth1(#sel-depth1)',
    '@change #sel-depth2': 'onChangeDepth2(#sel-depth2)',
    '@change #ckb-sel': 'onChangeSel(#ckb-sel)'
  },

  viewDidMount() {
    this.setModel({
      depth1: [
        { label: '한식', value: 'korean', selected: true },
        { label: '중식', value: 'chinese' },
        { label: '양식', value: 'western' },
        { label: '기타', value: 'etc' }
      ]
      // depth2: sampleData['korean'],
      // selectAll: false
    });
  },

  onChangeDepth1(val) {
    debugger;
    // this.setModel({ depth2: sampleData[val] });
  },

  onChangeDepth2(val) {
    this.setModel({ selectedMenu: val });
  },

  onChangeSel(val) {
    this.setModel({ selectAll: val });
  }
});
