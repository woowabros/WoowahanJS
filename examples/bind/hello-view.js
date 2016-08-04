import Woowahan from '../../index';
import Template from './hello-view.hbs';

const sampleData = {
  'korean': ['맛집', '산들애 송파점', '본가 한식 전문'],
  'chinese': ['일공중식', '청 한남점', '태가원'],
  'western': [{ text: 'LA 청국장', value: 'la'}, { text: '뉴욕 비지찌개', value: 'ny' }],
  'etc': '없음'
};

export default Woowahan.View.create('Hello', {
  template: Template,

  events: {
    '@change #sel-depth1': 'onChangeDepth1(#sel-depth1)',
    '@change #sel-depth2': 'onChangeDepth2(#sel-depth2)'
  },

  viewDidMount() {
    this.setModel({
      depth1: 'korean',
      depth2: sampleData['korean'],
      selectedMenu: sampleData['korean'][0]
    });
  },

  onChangeDepth1(val) {
    this.setModel({ depth2: sampleData[val] });
  },

  onChangeDepth2(val) {
    this.setModel({ selectedMenu: val });
  }
});
