import Woowahan from '../../index';

global.$ = global.jQuery = Woowahan.$;

import { 
  MainView,
  LayoutView1, LayoutView2, LayoutView3,
  MainView1, MainView2, MainView3, 
  ContentView1, ContentView2, ContentView3,
  SubContentView1, SubContentView2 } from './view/';

const app = new Woowahan();

/* layout 생성 & 등록 */
app.use(Woowahan.Layout('.wrap', LayoutView1));
app.use(Woowahan.Layout('.wrap', LayoutView2));
app.use(Woowahan.Layout('.wrap', LayoutView3, { update: false }));

app.use(Woowahan.Store.create({ test: 'test' }));

/* 사이트맵 디자인 */
const siteDesign = [
  { url: '/', view: MainView, container: '.wrap' },
  { url: '/layout1', view: MainView1, container: '#content', layout: 'LayoutView1', pages: [
    { url: 'content1', view: ContentView1, pages: [
      { url: 'sub1', view: SubContentView1 },
      { url: 'sub2', view: SubContentView2 }
    ] },
    { url: 'content2', view: ContentView2, pages: [
      { url: 'sub1', view: SubContentView1 },
      { url: 'sub2', view: SubContentView2 }
    ]  },
    { url: 'content3', view: ContentView3, pages: [
      { url: 'sub1', view: SubContentView1 },
      { url: 'sub2', view: SubContentView2 }
    ]  }
  ] },
  { url: '/layout2', view: MainView2, container: '#content', layout: 'LayoutView2', pages: [
    { url: 'content1', view: ContentView1, pages: [
      { url: 'sub1', view: SubContentView1 },
      { url: 'sub2', view: SubContentView2 }
    ]  },
    { url: 'content2', view: ContentView2, pages: [
      { url: 'sub1', view: SubContentView1 },
      { url: 'sub2', view: SubContentView2 }
    ]  },
    { url: 'content3', view: ContentView3, pages: [
      { url: 'sub1', view: SubContentView1 },
      { url: 'sub2', view: SubContentView2 }
    ]  }
  ] },
  { url: '/layout3', view: MainView3, container: '#content', layout: 'LayoutView3', pages: [
    { url: 'content1', view: ContentView1, pages: [
      { url: 'sub1', view: SubContentView1 },
      { url: 'sub2', view: SubContentView2 }
    ]  },
    { url: 'content2', view: ContentView2, pages: [
      { url: 'sub1', view: SubContentView1 },
      { url: 'sub2', view: SubContentView2 }
    ]  },
    { url: 'content3', view: ContentView3, pages: [
      { url: 'sub1', view: SubContentView1 },
      { url: 'sub2', view: SubContentView2 }
    ]  }
  ] },
];

/* 사이트 옵션 */
const siteOption = { empty: page => { alert(`${page}는 없는 페이지!!`); } };

/* 웹앱 시작 */
app.start(siteDesign, siteOption);