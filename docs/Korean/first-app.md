# 첫 번째 앱 만들기

WoowahanJS로 작성된 단일 페이지 어플리케이션은 1개 이상의 뷰 컴포넌트와 이들 뷰를 관리하는 하나의 Application으로 구성됩니다.

다음 예제는 하나의 뷰와 하나의 어플리케이션 만으로 작동되는 아주 간단한 예제 코드입니다.

#### hello-view.js

```javascript
import Woowahan from 'woowahan';

export default Woowahan.View.create('Hello', {
  template: '<h1>Hello, WoowahanJs</h1>'
});
```

#### main.js

```javascript
import Woowahan from 'woowahan';
import HelloView from './hello-view';

const app = Woowahan();

app.start({
  url: '/', container: 'body', view: HelloView
});
```

`Woowahan.View.create` 정적 메소드로 새로운 뷰를 생성할 수 있습니다. 뷰는 이름과 옵션 객체로 구성됩니다.
뷰 이름은 문자열이라면 어떤 제약도 없으며 뷰를 구분할 수 있는 이름을 지어주시면 됩니다.
뷰 이름의 중복도 허용됩니다.
다만 브라우저 콘솔에서 로그 출력시 뷰 이름이 기본으로 출력되기 때문에 용이한 식별을 위해선 충분히 식별 가능한 이름을 권장합니다.

어플리케이션인 `app = Woowahan()`을 start 함으로서 전체 앱을 구동시킬 수 있습니다.
start의 첫 번째 파라메터는 라우팅 경로와 연결될 View의 구성 정보로 이루어진 객체를 받습니다.

```javascript
app.start({
  url: '/',
  view: MainView,
  container: 'body',
  pages: [
    { url: 'users', container: '.contents', view: UserView },
    { url: 'orders', container: '.contents', view: OrderView, pages: [
        { url: ':orderno', view: OrderDetailView, pages: [
            { url: 'edit', view: OrderEditView }
          ] 
        },
        { url: 'search', view: OrderSearchView }
      ]
    }
  ]
});
```

위와 같은 앱의 라우팅 경로 구성은 다음과 같이 됩니다.

* / => MainView
* /users => UserView
* /orders => OrderView
* /orders/10 => OrderDetailView
* /orders/10/edit => OrderEditView
* /orders/search => OrderSearchView

`Woowahan.View.create`로 만들어진 뷰의 UI 는 HTML로 생성할 수 있으며 Woowahan.View는 이를 template 으로 기술합니다. 만약 UI 가 없는 뷰를 만든다면 아래와 같이 할 수 있습니다.

```javascript
const emptyView = Woowahan.View.create('EmptyView');
```

template에 HTML이 설정되지 않았다고 해서 실제로 View 가 아무 마크업도 없는 것은 아닙니다. HTML이 공급되지 않으면 `<div></div>`와 같은 상태가 됩니다. 

뷰는 UI가 필요하기 때문에 UI를 작성하기 위해서 첫 번째 셈플 코드와 같이 template에 HTML을 작성합니다. 빌드 후 브라우저를 구동하면 Hello, WoowahanJs이 표시되는 것을 보실 수 있습니다.

[뷰 소개 및 기초](./view.md)

