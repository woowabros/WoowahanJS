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

main.js 파일에는 어플리케이션인 app과 뷰 Main이 함께 존재합니다. 보통의 경우 뷰에는 많은 양의 내용이 기술되며 복잡도가 올라갈 수 있으며 여러 뷰에서 재활용될 수 있기 때문에 view는 독립된 파일로 분리하여 작성할 것을 권장합니다. 다음과 같이 main.js 와 main-view.js 로 분리할 수 있습니다.

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

