# 뷰


뷰는 어플리케이션을 구성하는 컴포넌트의 기본 단위입니다.
뷰는 라우터에 연결될 수 있으며 하나 이상의 자식 뷰를 가질 수 있습니다.
뷰는 재사용될 수 있도록 의도적인 구성이 아니라면 구성 독립성을 지원합니다.
즉, 어떤 뷰든 자식 뷰도 될 수 있고 부모 뷰도 될 수 있습니다.

앞서 가장 간단한 뷰를 만드는 방법을 보았습니다. 
이제 실무에서 사용될 수 있는 기본적인 뷰의 형태를 살펴보도록 하겠습니다.

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

뷰가 생성시 initialize 함수가 작성되어 있다면 가장 먼저 실행됩니다.
따라서 뷰 컴포넌트 생성시 필요한 초기화 작업을 기술할 수 있습니다.
만약 초기화 작업이 필요 없다면 initialize 함수는 생략할 수 있습니다.

## 뷰 모델

뷰는 뷰가 유지되고 있는 동안 스스로의 상태 즉, 모델을 가질 수 있습니다.
모델은 Javascript의 기본 객체의 형태지만 추가적으로 유용한 몇 가지 기능을 제공합니다.
모델의 디자인은 뷰가 어떤 작업을 수행하느냐에 따라 달라질 수 있으며 이는 전적으로 개발자가 결정해야할 문제입니다.

모델은 상황에 따라 initialize 에서 처음 설정하기도 하며, 외부에서 주입된 데이타로 구성될 수 도 있습니다.
어떤 경우라 하더라도 모델을 설정하거나 설정된 모델의 값을 얻어올 때 this.setModel()과 this.getModel() 메소드를 사용하십시오.

예제 코드의 initialize 에서 setModel을 이용하여 모델을 설정하고 있습니다.
setModel은 반복하여 여러번 호출될 수 있으며 호출시 포함된 키가 중복되지 않는다면 이전의 키 값은 유지됩니다.

```Javascript
this.setModel({ name: 'foo' }); // name=foo  <- new key
this.setModel({ gender: 'male' }); // name=foo, gender=male <- new key
this.setModel({ name: 'bar', age: 30 }); // name=bar, gender=male, age=30 <- new & edit key
```

getModel은 뷰가 가지고 있는 모델의 값을 반환합니다. this.getModel('name') 이라면 'bar' 값을 반환합니다.
getModel의 인자값 없이 호출되면 model 값 전체를 반환합니다.
반환되는 값은 순수한 Javascript Object 입니다.

```Javascript
var model = this.getModel();
/*
model = { name: 'bar', gender: 'male', age: 30 }
*/
```

다음과 같은 코드의 의도가 모델의 값을 변경하는 것 이었다면 의도대로 작동하지 않습니다.
```Javascript
var model = this.getModel();

model.name = 'foo'; // 뷰 모델 name 값은 변경되지 않습니다.

this.setModel({ name: 'foo' }); // 뷰 모델 name 값이 'foo'로 변경됩니다.
```

모델의 값을 변경하려 한다면 반드시 setModel을 사용하십시오.

## 템플릿

UI를 구성하는 HTML은 기본적으로 Template 문자열입니다.
WoowahanJS 0.1.* 버전에선 아쉽지만 Handlebars 단일 템플릿 엔진만을 지원합니다.
Handlebars 템플릿 파일을 import 구문을 이용하여 사용하는 것은 [프로젝트 환경 구성](./project-setup.md)항목에 자세히 설명되어 있습니다.

뷰의 UI가 화면에 그려질 때 - 이를 랜더링되었다 라고 표현하겠습니다 - 뷰의 모델 데이타와 합성됩니다.
따라서 템플릿 작성자는 뷰가 어떤 형태의 모델 데이타를 제공하는지 알아야합니다. 
뷰를 개발하는 개발자와 UI 엔지니어가 다르다면 모델의 디자인에 대해서 충분히 협의되어야합니다.

Handlebars 템플릿 엔진은 다양한 표현식을 제공하며 이에대한 학습이 필요합니다.
심화 과정에서 실무에 필요한 상세한 내용을 학습할 수 있으나 Handlebars가 제공하는 기본적인 정보는 [Handlebars 공식 사이트](http://handlebarsjs.com)에서 확인하실 수 있습니다.

## 뷰 태그

뷰의 최상위 DOM 엘리먼트는 지정하지 않는다면 항상 DIV 입니다.
뷰의 형태에 따라 필요한 Tag로 변경할 수 있으며 tagName 으로 설정됩니다.
tagName은 당연하게도 자식 요소를 가질 수 있는 Tag여야하며 그렇지 않은 BR 등은 사용할 수 없습니다.

## 뷰 클래스

tagName의 class 속성입니다.

## 뷰 라이프사이클

뷰 컴포넌트는 initialize -> viewWillMount -> (rendering) -> viewDidMount -> viewWillUnmount -> close 와 같은 라이프사이클을 가집니다.
initialize 는 단 한번만 호출되며 viewWillMount ---- viewWillUnmount 는 1번 이상 반복되어 실행될 수 있습니다.

개발자는 랜더링에 직접적으로 관여할 수 없지만 랜더링 되기 전과 랜더링 완료후에 필요한 작업을 할 수 있습니다.

랜더링이란 뷰의 템플릿과 뷰의 모델을 합성하여 완성된 HTML 문자열을 만들고 DOM로딩을 수행하는 과정입니다. 

viewWillMount는 랜더링시 주입되는 모델 데이타를 수정할 수 있는 기회를 제공합니다.
인수로 제공되는 renderData 를 변경함으로서 랜더링에 간접적으로 관여할 수 있습니다.
모델 데이타 수정이 완료되면 반드시 renderData를 반환해야합니다.
아무값도 반환하지 않을 경우 변경된 데이타는 랜더링시 적용되지 않고 원래의 모델 데이타가 적용됩니다.

viewWillMount 에서 변경한 renderData는 뷰 모델의 사본 객체이며 따라서 실제 뷰 모델을 변경시키지는 않습니다.

다음 코드에서 올바른 viewWillMount 작성법과 올바르지 않은 viewWillMount 작성법을 확인할 수 있습니다.

```Javascript
/*
 * Good
 */
viewWillMount(renderData) {
  renderData.name = `이름은 ${renderData.name}`;
  return renderData;
}

/*
 * Bad - renderData를 반환하지 않음
 */
viewWillMount(renderData) {
  renderData.name = `이름은 ${renderData.name}`;
}

/*
 * Bad - 모델값을 직접 변경. 모델 값은 변경되나 랜더링에 반영되지 않음
 */
viewWillMount(renderData) {
  this.setModel({ name: `이름은 ${renderData.name}` });
  return renderData;
}
```

## 이벤트

UI에서 발생하는 이벤트는 events 속성으로 손쉽게 이벤트와 이벤트 핸들러를 연결할 수 있습니다. events 속성은 뷰 생성시 정의하며 기본 형식은 다음과 같습니다.

```Javascript
Woowahan.View.create('ViewName', {

  events: {
    "eventName DOM-Selector":            "EventHandler", // 기본 형태 설명
    "click .btn.btn-save":               "onSave",
    "dbclick .nav.ico-logout":           "onLogout",
    "keypress .form-control.txt-search": "onAutoSearch"
  },
  
  onSave(event) { 
    // Do something
  },
  
  onLogout(event) { 
    // Do something
  },
  
  onAutoSearch(event) {
    // Do something
  }
  
});
```

자식 뷰의 이벤트를 받거나 이벤트와 함께 사용자 데이타를 수집하고자 할 때 "@" 이벤트를 사용할 수 있습니다. 

## 자식 뷰

모든 뷰는 자식 뷰 즉, 하위 뷰 요소를 포함할 수 있습니다. UI를 구성함에 있어 하나의 거대한 단일 뷰로 디자인할 것인지, 아니면 좀 더 작은 단위의 UI요소로 분해하여 조립할지는 전적으로 개발자의 디자인 방식에 의존합니다.

그러나 아주 단순한 앱이 아니라면 대부분의 앱은 여러개의 뷰로 구성됩니다. 이렇게 복수개의 뷰로 구성될 때 필연적으로 뷰와 뷰 사이에 상위 뷰와 하위 뷰 관계가 만들어집니다. 상위 뷰 즉, 부모 뷰는 자식 뷰를 포함하기 위한 컨테이너를 제공하여야 하며 동시에 추가되는 자식 뷰가 1개 이상이라면 1개 이상의 컨테이너를 가진 HTML 구성을 가져야 합니다.

다음과 같이 updateView 메소드로 자식뷰를 추가할 수 있습니다.

```Javascript
import ChildView1 from './child1';
import CHildView2 from './child2';

Woowahan.View.create('ParentView', {

  initialize() {
    this.updateView('.nav', ChildView1);
    this.updateView('.dashboard', ChildView2);
  }
  
});
```

자식 뷰에게 데이타를 넘겨줄 필요가 있다면 updateView의 세번째 인수로 전달할 수 있습니다.

```Javascript
this.updateView('.nav', ChildView, { current: 'main' });
```

만약 부모 뷰의 무언가 변경사항이 생겨 자식 뷰를 업데이트해야 한다면 어떻게 해야할까요? 자식 뷰를 추가하는 메소드 이름이 updateView인 것은 이것 때문입니다. 자식 뷰의 변경사항이 발생한다면 최초 추가할 때와 같은 방식으로 updateView를 호출하면 됩니다. 이것은 updateView 메소드가 자식의 라이프사이클을 완전히 통제한다는 것을 보여주며 자식뷰를 생성하여 다음과 같이 updateView를 사용하면 동작을 보장하지 않습니다.

```Javascript
/* 
 * 정상 동작하지 않음
 */
var childView = new ChildView({ current: 'main' });
 
this.updateView('.nav', childView);
```

### 뷰 새로 그리기

updateView는 자식 뷰 관련 기능 뿐만 아니라 현재 뷰의 UI를 다시 랜더링할 수 있는 기능도 제공합니다. 뷰가 자신을 다시 그려야하는 경우는 언제 발생할까요? 뷰 데이타가 변경되고 변경사항이 UI에 반영되어야 할 때 뷰를 새로 그려야할 것입니다. 이런 경우 this.updateView() 처럼 인수 없이 호출하면 현재 뷰를 다시 그리게되며 자식 뷰가 있을 경우 자동으로 새로 그려지게 됩니다.

다시 랜더링된다는 것의 보다 정확한 의미는 뷰의 생애 주기인 initialize -> viewWillMount -> (rendering) -> viewDidMount -> viewWillUnmount -> close 에서 viewWillMount -> (rendering) -> viewDidMount 주기를 다시 실행하는 것을 의미합니다.

## 자식 뷰와의 커뮤니케이션

뷰의 모든 행위가 뷰 내에서 모두 다루어지는 경우도 있지만 뷰 밖의 영역으로 뷰 내의 행위를 알려야하는 경우도 있습니다. 부모 뷰와 자식 뷰간에는 더욱 더 빈번할 수 있습니다. 이를 간편히 처리하기 위해 "@" 이벤트 방식이 제공됩니다.

events 정의 방식과 동일하게 자식 뷰가 발생시키는 이벤트를 수신받기 위해서 부모 뷰는 events에 동일하게 작성할 수 있습니다. 한 가지 다른 점은 이벤트 이름 앞에 @를 붙이는 것입니다. 다음과 같습니다.

```Javascript
var ChildView = Woowahan.View.create('ChildView', {
  doSomething() {
    this.trigger('save', { name: 'KIM', age: 10 }); // 자식 뷰의 이벤트를 부모 뷰가 수신받는다.
  }
});

Woowahan.View.create('ParentView', {
  events: {
    '@save .nav': 'onSave'
  },
  
  initialize() {
    this.updateView('.nav', ChildView1);
  },
  
  onSave(data) {
    // Do something
  }
});
```

이벤트를 발생시키는 자식 뷰는 this.trigger 메소드로 이벤트를 발생시킬 수 있습니다. 첫 번째 인수는 이벤트 이름, 두 번째 인수는 이벤트와 함께 전달할 데이타입니다. 이벤트 이름은 평범한 문자열이며 데이타에 대한 형식 제한은 특별히 없습니다.

## 이벤트와 함께 입력 데이타 수집

사용자가 입력한 데이타를 이벤트와 함께 수집해야하는 경우가 있습니다. 검색창에 검색어를 입력한 후 검색 버튼을 클릭하는 UI 라면 검색 버튼의 클릭 이벤트 핸들러에선 검색창의 데이타를 가져오는 코드가 필요합니다. 떄로는 회원가입 입력 폼과 수집되어야 하는 데이타가 수십개에 이를 수 도 있습니다.

웹 UI는 사용자 데이타를 입력받기 위한 다양한 폼 요소를 지원하며 요소의 타입에 따라 값을 얻어오는 방식이 다릅니다. 각각의 방식을 개발자가 학습해야할 필요가 있고 데이타를 수집하는 반복적인 코드를 작성해야만 합니다.

"@" 이벤트 방식의 두 번째 기능은 이벤트와 데이타를 함께 묶어주는 것입니다. 검색창 예를 떠올려 봅시다. 검색창은 keyword란 이름을 가지고 있는 input text 요소이며 btn-search 버튼이 검색 버튼입니다. btn-search 버튼이 클릭되면 검색을 수행하게 됩니다. 이를 다음과 같이 표현할 수 있습니다.

```Javascript
  events: {
    '@click .btn-search': 'onSearch(input[name=keyword])'
  }
  
  onSearch(keyword) {
    // keyword === 사용자가 입력한 검색 키워드 문자열
  }
```

만약 검색 옵션도 있다면 다음과 같이 되겠죠.

```Javascript
  events: {
    '@click .btn-search': 'onSearch(input[name=keyword], .search.option)'
  }
  
  onSearch(keyword, option) {
    // Do search
  }
```

모든 폼 데이타를 수집해야 한다면 다음과 같이 작성합니다.

```Javascript
  events: {
    '@submit .join-form': 'onJoin()'
  }
  
  onJoin(form) {
    /*
     form.name
     form.password
     form.gender
     ...
    */
    // Do Something
  }
```
