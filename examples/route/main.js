import Woowahan from '../../';

import { 
  MainView,
  LayoutView1, LayoutView2, LayoutView3,
  MainView1, MainView2, MainView3, 
  ContentView1, ContentView2, ContentView3 } from './view/';

const app = new Woowahan;

/* layout 생성 & 등록 */
app.use(Woowahan.Layout('.wrap', LayoutView1));
app.use(Woowahan.Layout('.wrap', LayoutView2));
app.use(Woowahan.Layout('.wrap', LayoutView3));

/* 사이트맵 디자인 */
const siteDesign = {
  design: [
    { url: '/', view: MainView, container: '.wrap' },
    { url: '/layout1', view: MainView1, container: '#content', layout: 'LayoutView1', pages: [
      { url: '/layout1/content1', view: ContentView1, container: '#content' },
      { url: '/layout1/content2', view: ContentView2, container: '#content' },
      { url: '/layout1/content3', view: ContentView3, container: '#content' }
    ] },
    { url: '/layout2', view: MainView2, container: '#content', layout: 'LayoutView2', pages: [
      { url: '/layout2/content1', view: ContentView1, container: '#content' },
      { url: '/layout2/content2', view: ContentView2, container: '#content' },
      { url: '/layout2/content3', view: ContentView3, container: '#content' }
    ] },
    { url: '/layout3', view: MainView3, container: '#content', layout: 'LayoutView3', pages: [
      { url: '/layout3/content1', view: ContentView1, container: '#content' },
      { url: '/layout3/content2', view: ContentView2, container: '#content' },
      { url: '/layout3/content3', view: ContentView3, container: '#content' }
    ] },
  ],
  options: { empty: page => { alert(`${page}는 없는 페이지!!`); } }
};

/* 웹앱 시작 */
app.start(siteDesign);