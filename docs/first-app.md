# 첫 번째 앱 만들기

WoowahanJS로 작성된 단일 페이지 어플리케이션은 1개 이상의 뷰 컴포넌트와 이들 뷰를 관리하는 하나의 Application으로 구성됩니다.

다음 예제는 하나의 뷰와 하나의 어플리케이션 만으로 작동되는 아주 간단한 예제 코드입니다.

#### main.js
```Javascript
import Woowahan from 'woowahan';

const Main = Woowahan.View.create('Main', {
  template: '<h1>Hello, WoowahanJs</h1>',
  initialize() {
    this.super();
  }
});

const app = Woowahan();

app.start({
  url: '/', container: 'body', view: Main
});
```

`Woowahan.View.create` 정적 메소드로 새로운 뷰를 생성합니다. 뷰는 이름과 옵션 객체로 구성됩니다.
이름 명명 규칙에 문자열이라면 어떤 제약도 없으며 뷰를 구분할 수 있는 적당한 이름을 지어주시면 됩니다.
뷰 이름의 중복도 허용됩니다.
다만 브라우저 콘솔에서 로그 출력시 뷰 이름이 기본으로 출력되기 때문에 용이한 식별을 위해선 충분히 식별 가능한 이름을 권장합니다.

어플리케이션인 app은 start 메소드로 전체 앱 구동을 시작합니다.
start의 첫 번째 파라메터는 라우팅 경로와 연결될 View의 구성 정보로 이루어진 객체를 받습니다.
다음과 같은 형태입니다.

```javascript
{
  url: '/',
  view: MainView,
  container: 'body',
  pages: [
    { url: 'users', container: '.contents', view: UserView },
    { url: 'orders', container: '.contents', view: OrderView, pages:
        [
            { url: ':orderno', view: OrderDetailView },
            { url: ':orderno/edit', view: OrderEditView }
        ]
    }
  ]
}
```

main.js 파일에는 어플리케이션인 app과 뷰 Main이 함께 존재합니다.
보통의 경우 뷰에는 많은 양의 내용이 기술되며 복잡도가 올라갈 수 있으며 여러 뷰에서 재활용될 수 있기 때문에 view는 독립된 파일로 분리하여 작성할 것을 권장합니다.
다음과 같이 main.js 와 main-view.js 로 분리할 수 있습니다.

#### main.js
```Javascript
import Woowahan from 'woowahan';
import MainView from './main-view';

const app = Woowahan();

app.start({
  url: '/', container: 'body', view: Main
});
```

#### main-view.js
```Javascript
import Woowahan from 'woowahan';

export default Woowahan.View.create('Main', {
  template: '<h1>Hello, WoowahanJs</h1>',
  initialize() {
    this.super();
  }
});
```

