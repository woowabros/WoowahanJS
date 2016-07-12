# 이벤트

UI에서 발생하는 이벤트와 이벤트 핸들러는 events 속성 설정으로 쉽게 연결할 수 있습니다.
events 속성은 뷰 생성시 정의하며 기본 형식은 다음과 같습니다.

```javascript
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

이벤트 핸들러는 DOM on-event 핸들러와 동일하며 같은 방식으로 작성하여 사용할 수 있습니다. 마우스 커서의 이동을 감지하여 좌표를 콘솔에 출력하고, Text Input 요소에 입력 값을 출려하는 다음 예제를 참고하세요.

```javascript
events: {
  'mousemove .canvas': 'detectMounsePosition',
  'keypress .input-box': 'detectInputValue'
},

detectMounsePosition(event) {
  console.log('x: %s, y: %s', event.screenX, event.screenY);
},

detectInputValue(event) {
  console.log(event.target.value);
}
```

## 자식 뷰와의 커뮤니케이션

뷰의 행위가 뷰 내에서 모두 다루어지는 경우도 있지만 뷰 밖의 영역으로 뷰 내의 행위를 알려야하는 경우도 있습니다.
부모 뷰와 자식 뷰간에는 더욱 더 빈번할 수 있습니다.
자식 뷰에서 발생하는 이벤트를 부모 뷰로 보내기 위해선 다음과 같은 과정이 필요합니다.

```html
<!-- parentView 시작 -->
<div class="search-form">
  <!-- childView 시작 -->
  <form>
    <input type="text" name="input-search">
    <button type="button" class="btn btn-search">Search</button>
  </form>
  <!-- childView 끝 -->
</div>
<div>
  <table>
  </table>
</div>
<!-- parentView 끝 -->
```

```javascript
var childView = Woowahan.View.create('Child', {
 
});

var parentView = Woowahan.View.create('Parent', {
  events: {
    'click .btn.btn-search': 'onSearch'
  },
    
  viewDidMount() {
    this.updateView('.search-form', childView);
  },
  
  onSearch() {
    // Do something... 
  }
});

```
이 셈플과 같은 방식의 문제점은 parentView와 childView간 HTML 종속성이 만들어진다는 것입니다.
parentView 입장에선 childView의 HTML 구조를 알아야하며 childView 입장에선 부모가 자신의 UI 중 일부의 이벤트 핸들러를 부모 뷰가 한다는 것도 기억해야합니다.
코드로 기술되지 못하기 때문에 내용을 알지 못한다면 숨겨진 로직이 될 수 밖에 없습니다.

부모 뷰와 자식 뷰간 종속성을 없애고 처리 방식도 손쉽게 할 수 있는  @이벤트가 제공됩니다.
@이벤트를 이용하여 개선한 코드는 다음과 같습니다. 
(HTML 코드는 동일하여 반복 기술하지 않습니다)

```javascript
var childView = Woowahan.View.create('Child', {
  events: {
    'click .btn.btn-search': 'onSearch'
  },
  
  onSearch() {
    this.dispatch(Woowahan.Event.create('search'));
  }
});

var parentView = Woowahan.View.create('Parent', {
  events: {
    '@search': 'onSearch'
  }
    
  viewDidMount() {
    this.updateView('.search-form', childView);
  },
  
  onSearch() {
    // Do something... 
  }
});

```

parentView와 childView는 명시적으로 `search` 이벤트로 커뮤니케이션하도록 변경되었습니다.
마크업 구조의 종속성은 제거되어 childView는 parentView와 상관 없이 마크업 구조 등을 변경할 수 있게되었습니다.

childView는 btn-search 버튼이 클릭되면 외부로 이벤트를 내보낸다는 것이 명시적인 코드로 표현되었습니다.
숨겨진 로직은 사라졌기 때문에 명확하게 코드를 관리할 수 있게 되었습니다.

이 셈플에서 두 가지 다루지 않았던 표현이 등장합니다. 
이벤트를 외부로 발행하고, 자식 뷰의 이벤트를 수신받는 표현입니다.

## 이벤트 발행하기

외부로 이벤트를 발행할 때도 dispatch가 사용됩니다.
dispatch 메소드로 발행할 수 있는 이벤트를 생성하기 위해서 Woowahan.Event.create 핼퍼 함수가 제공됩니다.
예제와 같이 생성한 이벤트를 dispatch 할 수 있습니다.
이벤트와 함께 데이타를 전달해야 한다면 이벤트 이름 다음 인수로 데이타를 기술할 있으며 개수와 타입은 제한이 없습니다.

```javascript
this.dispatch(Woowahan.Event.create('search', { keyword: 'javascript' }));
```

## 자식 뷰 이벤트 수신하기

자식 뷰가 dispatch한 이벤트를 부모 뷰가 수신하기 위해선 단지 events 속성에 @이벤트이름 형식으로 이벤트 핸들러와 함께 지정하기만 하면 됩니다.

```javascript
events: {
  '@search': 'onSearch'
}
```

@이벤트의 경우 DOM on-event와 표현과 달리 이벤트 이름 다음에 오는 selector가 생략 가능합니다.
selector를 생략하지 않는다면 updateView로 자식 뷰를 추가할 때 명시했던 selector를 기술합니다.
위 예제를 기준으로 한다면 다음과 같이 기술할 수 있습니다.

```javascript
events: {
  '@search .search-form': 'onSearch'
}
```

자식 뷰의 이벤트 수신에 selector가 필요한 경우는 자식 뷰를 서로 다른 container에 추가한 경우입니다.
N 개의 자식 뷰가 N 개의 container에 추가된 구조일 경우 명시적으로 selector 지정이 필요합니다.

## 이벤트와 함께 입력 데이타 수집

사용자가 입력한 데이타를 이벤트와 함께 수집해야하는 경우가 있습니다.
검색창에 검색어를 입력한 후 검색 버튼을 클릭하는 UI 라면 검색 버튼의 클릭 이벤트 핸들러에선 검색창의 데이타를 가져오는 코드가 필요합니다. 
때로는 회원가입 입력 폼과 수집되어야 하는 데이타가 수십개에 이를 수 도 있습니다.

웹 UI는 사용자 데이타를 입력받기 위한 다양한 폼 요소를 지원하며 요소의 타입에 따라 값을 얻어오는 방식이 다릅니다.
각각의 방식을 개발자가 학습해야할 필요가 있고 데이타를 수집하는 반복적인 코드를 작성해야만 합니다.

@이벤트 방식의 두 번째 기능은 이벤트와 데이타를 함께 결합해 주는 것입니다.
이전 예제의 onSearch를 생각해 봅시다.
검색 버튼이 클릭 되었을 때 search 이벤트와 함께 사용자가 입력한 검색어를 전달해야합니다.
사용자가 입력한 검색어는 name="input-search"인 INPUT 엘리먼트에 담겨 있습니다.
관련 기능을 추가하면 다음과 같습니다.

```javascript
var childView = Woowahan.View.create('Child', {
  events: {
    'click .btn.btn-search': 'onSearch'
  },
  
  onSearch() {
    var keyword = this.$el.find('input[name=keyword]').val();
    
    this.dispatch(Woowahan.Event.create('search', keyword));
  }
});

var parentView = Woowahan.View.create('Parent', {
  events: {
    '@search': 'onSearch'
  },
  
  onSearch(keyword) {
    // Do something... 
  }
});
```

> this.$el은 뷰가 제공하는 DOM 접근을 위한 뷰의 jQuery DOM 참조 객체입니다. 
> jQuery 객체이며 뷰와 관련된 jQuery 연산을 동일하게 사용 가능합니다.

DOM 처리가 코드로 기술되어야 하기 때문에 불편함이 발생합니다.
@이벤트를 이용하여 DOM 처리 코드를 제거해 보겠습니다.

```javascript
var childView = Woowahan.View.create('Child', {
  events: {
    'click .btn.btn-search': 'onSearch(input[name=keyword])'
  },
  
  onSearch(keyword) {
    this.dispatch(Woowahan.Event.create('search', keyword));
  }
});

/* parentView 코드는 동일하여 생략 */
```

이벤트 핸들러 함수 표현에 수집할 데이타의 selector 를 지정함으로서 간단히 이벤트 핸들러에 데이타를 결합할 수 있습니다.
만약 검색 옵션도 있다면 다음과 같이 되겠죠.
이벤트 핸들러와 결합될 데이타의 수에는 제한이 없습니다. 
필요한 만큼 사용하시면 됩니다.

지정된 셀렉터의 엘리먼트 타입의 형식에 맞춰 데이타가 수집됩니다.

```javascript
  events: {
    '@click .btn-search': 'onSearch(input[name=keyword], .search.option)'
  }
  
  onSearch(keyword, option) {
    // Do search
  }
```

FORM submit과 같이 폼 데이타를 수집해야 한다면 다음과 같이 작성할 수 있습니다.

```javascript
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

@이벤트의 selector 가 FORM인 경우 하위 FORM 요소의 모든 데이타를 수집하여 이벤트 핸들러에 전달합니다.

## 어플리케이션 이벤트

어플리케이션 범위의 이벤트가 지원됩니다.
개별 뷰 범위를 떠나 앱 전체에 걸쳐 발생하는 이벤트입니다.
새로운 작업(Action -> Reducer)이 시작되거나 모든 작업이 완료되었을 경우 각각 정의된 이벤트가 발생합니다.

만약 어플리케이션 이벤트를 수신받고자 한다면 다음과 같이 할 수 있습니다.

```javascript
var app = new Woowahan();

app.on('start', function() {
  // Do something
  console.log(app.numberOfAction());
  console.log(app.numberOfWorkAction());
});

app.on('finish', function() {
  // Do something
});

app.on('error', function(errs) {
  // Do something
});
```

전역 이벤트 수신자에선 작업 진행 상황 및 오류 처리에 대한 처리를 어플리케이션 수준에서 - 토스트 팝업을 표시한다거나 - 구현할 할 때 유용한 구조를 제공합니다.
