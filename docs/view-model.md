# 뷰 모델 및 데이타 바인딩

## 뷰 모델

모든 뷰는 필요한 경우 상태를 가질 수 있습니다.
뷰가 가진 상태를 `뷰 모델`이라 합니다.
뷰 모델은 뷰의 템플릿과 결합되어 뷰의 UI를 구성합니다.

뷰가 유지되는 동안 함께 유지되어야하는 상태가 있다면 initialize에서 초기화 하는 것을 권장합니다.

```javascript
Woowahan.View.create('MyView', {
  initialize() {
    this.setModel({
      title: '사용자 목록'
    });
  }
});
```

뷰 모델을 만들기 위해 setModel 메소드가 제공됩니다.
인자로 모델 객체를 받으며 형식에 제한은 없습니다.

## 상태 주입 및 변경

뷰를 랜더링하기전 viewWillMount에서 상태를 변경하거나 추가 할 수 있습니다.

#### myview.hbs
```handlebars
<time{{#if holiday}} class="holiday"{{/if}}>{{today}}</time>
```

```javascript
import Template from './myview.hbs';

Woowahan.View.create('MyView', {
  template: Template,
  initialize() {
    this.setModel({
      today: '2001-10-21'
    });
    
    this.super();
  },
  
  viewWillMount(renderData) {
    let today = new Date(this.getModel('today'));
    let day = today.getDay();
    
    if (day === 0 || day === 6) {
      renderData.holiday = true;
    } else {
      renderData.holiday = false;
    }
    
    return renderData;
  },
  
  viewDidMount($el) {
    console.log(this.getModel('holiday')); /* undefined */
  }
});
```

뷰가 랜더링된 이후 HTML 결과는 다음과 같습니다.

```html
<time class="holiday">2001-10-21</time>
```

템플릿과 결합하기 전 예제에선 today가 휴일인지 아닌지를 검사하여 holiday 값을 추가합니다.
이때 추가된 holiday 값은 템플릿 내에서 참조되어 적용됩니다.
그러나 랜더링이 끝난 후 호출되는 viewDidMount에서 getModel 로 holiday 값을 모델에서 얻고자 하면 값이 없습니다. 이는 viewWillMount로 전달되는 renderData가 랜더링 직전 사용되는 일회용 값 이라는 것을 의미합니다.

## 데이타 바인딩

모델로 설정된 상태 값은 HTML 태그에 연결시킬 수 있습니다.
다음 예제는 버튼을 누르면 타이머가 시작되고 다시 버튼을 누르면 타이머가 종료되는 간단한 예제입니다.
전체 코드는 examples/timer에서 확인하실 수 있습니다.

```handlebars
<button data-role="bind" data-name="buttonLabel">{{buttonLabel}}</button>
<time data-role="bind" data-name="time">{{time}}</time>
```

```javascript
Woowahan.View.create('TimerView', {
  template: Template,

  events: {
    'click button': 'onTimerToggle'
  },

  initialize() {
    this.updateHandle = null;
    this.startTime = 0;
    
    this.setModel({ 
      time: this.startTime, 
      buttonLabel: 'START' 
    });

    this.super();
  },

  onTimerToggle() {
    if (this.updateHandle) this.stopTimer();
    else this.startTimer();
  },

  stopTimer() {
    clearInterval(this.updateHandle);

    this.updateHandle = null;
    this.setModel({ buttonLabel: 'START' });
  },

  startTimer() {
    this.setModel({ buttonLabel: 'STOP' });
    this.startTime = Date.now();

    this.updateHandle = setInterval(() => {
      this.setModel({ 
        time: (Date.now() - this.startTime) / 1000 
      });
    }, 1000/30);
  },
  
  viewWillUnmount() {
    this.updateHandle && clearInterval(this.updateHandle);
  }
});
```

#### 셈플 코드 실행 화면
![타이머 예제 실행 화면](../assets/timer.gif)

데이타 바인딩은 HTML 태그에 data-role="bind" 속성으로 표현합니다.
바인딩된 태그와 연결될 모델 내 키 값은 data-name="model-attr-name" 으로 지정됩니다.
data-type에 따라 연결된 모델 속성 값이 변경되면 해당 태그를 다시 랜더링합니다.

지원하는 data-type 은 text, select 등이 있고 지원 타입 현황에서 확인하실 수 있습니다.

데이타 바인딩은 One-way 바인딩 방식입니다.
즉, 모델의 값이 변경되면 UI에 적용될 뿐 UI에 값이 변경된다 해서 Model에 값을 반영하진 않습니다.
양방향 바인딩을 - Two-way - 지원하는 AngularJS와는 다른 단방향 바인딩 방식을 지원합니다.

