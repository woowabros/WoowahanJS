# Route

SPA 웹앱 구조에서 라우팅을 이용하는 방법을 볼 수 있습니다.


```
npm install

npm run dev
```

[http://localhost:8080/](http://localhost:8080/) 에서 확인 가능합니다.

## 라우팅 등록방법

```
/*
{
  url: url,
  view: view,
  container: view가 그려질 대상돔,
  layout: 해당 url에서 사용될 layout,
  pages: 서브 url 정보및 해당 뷰정보
}
*/  
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
] }
```

layout(LayoutView1..)의 #content에 서브뷰가 그려지게 됩니다.
