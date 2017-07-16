import Woowahan from '../../index';

global.$ = global.jQuery = Woowahan.$;

import {
  MainView,
  LayoutView1, LayoutView2, LayoutView3,
  MainView1, MainView2, MainView3, 
  ContentView1, ContentView2, ContentView3,
  SubContentView1, SubContentView2 } from './view/';
import { DISPATCH_ACTION } from './action';

import { AppMiddleware, ViewMiddleware, ReducerMiddleware, RouterMiddleware, RouterMiddlewarePre } from './middleware';

const app = new Woowahan();

app.set(AppMiddleware, 'test');
app.set(ViewMiddleware, 'test');
app.set(ReducerMiddleware, 'test');
app.set(RouterMiddlewarePre);
app.set(RouterMiddleware, 'test');

/* layout 생성 & 등록 */
app.use(Woowahan.Layout('.wrap', LayoutView1));
app.use(Woowahan.Layout('.wrap', LayoutView2));
app.use(Woowahan.Layout('.wrap', LayoutView3, { update: false }));

app.use(Woowahan.Store.create({ test: 'test' }));

app.use(Woowahan.Reducer.create(DISPATCH_ACTION, function() {
  this.onSuccess = function(res) {
    this.finish(res);
  };

  this.getData('https://jsonplaceholder.typicode.com/posts');
}));

/* 사이트맵 디자인 */
const siteDesign = [
  { url: '/', view: MainView, container: '.wrap' },
  { url: '/layout1', view: MainView1, container: '#content', layout: 'LayoutView1', routeName: 'Layout1', pages: [
    { url: 'content1', view: ContentView1, routeName: 'Layout1Content1', pages: [
      { url: 'sub1', view: SubContentView1, routeName: 'Layout1Content1Sub1' },
      { url: ':sub2', view: SubContentView2, routeName: 'Layout1Content1Sub2' }
    ] },
    { url: 'content2', view: ContentView2, routeName: 'Layout1Content2', pages: [
      { url: 'sub1', view: SubContentView1, routeName: 'Layout1Content2Sub1' },
      { url: 'sub2', view: SubContentView2, routeName: 'Layout1Content2Sub2' }
    ]  },
    { url: 'content3', view: ContentView3, routeName: 'Layout1Content3', pages: [
      { url: 'sub1', view: SubContentView1, routeName: 'Layout1Content3Sub1' },
      { url: 'sub2', view: SubContentView2, routeName: 'Layout1Content3Sub2' }
    ]  }
  ] },
  { url: '/layout2', view: MainView2, container: '#content', layout: 'LayoutView2', routeName: 'Layout2', pages: [
    { url: 'content1', view: ContentView1, routeName: 'Layout2Content1', pages: [
      { url: 'sub1', view: SubContentView1, routeName: 'Layout2Content1Sub1' },
      { url: 'sub2', view: SubContentView2, routeName: 'Layout2Content1Sub2' }
    ]  },
    { url: 'content2', view: ContentView2, routeName: 'Layout2Content2', pages: [
      { url: 'sub1', view: SubContentView1, routeName: 'Layout2Content2Sub1' },
      { url: 'sub2', view: SubContentView2, routeName: 'Layout2Content2Sub2' }
    ]  },
    { url: 'content3', view: ContentView3, routeName: 'Layout2Content3', pages: [
      { url: 'sub1', view: SubContentView1, routeName: 'Layout2Content3Sub1' },
      { url: 'sub2', view: SubContentView2, routeName: 'Layout2Content3Sub2' }
    ]  }
  ] },
  { url: '/layout3', view: MainView3, container: '#content', layout: 'LayoutView3', routeName: 'Layout3', pages: [
    { url: 'content1', view: ContentView1, routeName: 'Layout3Content1', pages: [
      { url: 'sub1', view: SubContentView1, routeName: 'Layout3Content1Sub1' },
      { url: 'sub2', view: SubContentView2, routeName: 'Layout3Content1Sub2' }
    ]  },
    { url: 'content2', view: ContentView2, routeName: 'Layout3Content2', pages: [
      { url: 'sub1', view: SubContentView1, routeName: 'Layout3Content2Sub1' },
      { url: 'sub2', view: SubContentView2, routeName: 'Layout3Content2Sub2' }
    ]  },
    { url: 'content3', view: ContentView3, routeName: 'Layout3Content3', pages: [
      { url: 'sub1', view: SubContentView1, routeName: 'Layout3Content3Sub1' },
      { url: 'sub2', view: SubContentView2, routeName: 'Layout3Content3Sub2' }
    ]  }
  ] },
];

/* 사이트 옵션 */
const siteOption = { empty: page => { alert(`${page}는 없는 페이지!!`); } };

/* 웹앱 시작 */
app.start(siteDesign, siteOption);