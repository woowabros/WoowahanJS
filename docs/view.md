# 뷰


뷰는 어플리케이션을 구성하는 컴포넌트의 기본 단위입니다.
뷰는 라우터에 연결될 수 있으며 하나 이상의 자식 뷰를 가질 수 있습니다.
뷰는 재사용될 수 있도록 의도적인 구성이 아니라면 구성 독립성을 지원합니다.
즉, 어떤 뷰든 자식 뷰도 될 수 있고 부모 뷰도 될 수 있습니다.

앞서 가장 간단한 뷰를 만드는 방법을 보았습니다. 
이제 실무에서 사용될 수 있는 기본적인 형태의 뷰의 형태를 살펴보도록 하겠습니다.

##### basic-view.hbs
````Handlebars
<h1>{{lastName}} {{firstName}}</h1>
<p>
  <button id="how-old-are-you">나이가 몇 살 일까요?</button>
</p>
```

##### basic-view.js
```Javascript
import Woowahan from 'woowahan';
import 
import Template from 'basic-view.hbs';

export default Woowahan.View.create('BasicView', {
  tagName: 'div',
  className: 'main light',
  template: Template,
  
  events: {
    'click #how-old-are-you': 'onHowOldAreYou'
  },
  
  initialize() {
    this.setModel({
      firstName: '길동',
      lastName: '홍',
      age: 573
    });
    
    this.super();
  },
  
  viewWillMount(renderData) {
    this.log(renderData);
    
    return renderData;
  },
  
  viewDidMount($el) {
  
  },
  
  viewWillUnmount() {
  
  },
  
  onHowOldAreYou() {
    alert(this.getModel('age'));
  }
});
```

## 뷰 초기화

## 뷰 모델

## 템플릿

## 뷰 클래스

## 뷰 태그

## 뷰 라이프사이클

## 이벤트

## 자식 뷰

## 자식 뷰와의 커뮤니케이션

