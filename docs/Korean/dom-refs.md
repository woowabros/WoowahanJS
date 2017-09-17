# 뷰의 DOM 참조

뷰 코드 안에서 DOM에 접근해야할 필요가 있습니다.
뷰가 로드된 시점 이후에 DOM API를 사용하여 접근하거나 편리하게 jQuery를 이용할 수 도 있습니다.
다음의 코드는 jQuery를 이용하여 UI내 엘리먼트를 토클하는 예제입니다.

```html
<div class="container">
    <div class="alert alert-success" role="alert">문제가 발생했습니다.</div>
    <button type="button" class="btn btn-toggle">Toggle</button>
</div>
```

```javascript
Woowahan.View.create('Foo', {
  template: Template,
  events: {
    'click .btn-toggle': 'onToggleElement'
  },

  onToggleElement(event) {
    this.$el.find('.alert').toggle();
  }
});
```

## Refs

뷰 코드 내에서 DOM 접근을 셀렉터 기반으로 기술하면 UI 구조와(CSS 네이밍 포함) 강력한 종속성으로 결합됩니다.
결합의 강도가 강하면 UI 변경에 따른 뷰의 정상 동작을 보증할 수 없게됩니다.
UI와(DOM) 의 결합을 느슨하게 유지하는 방법으로 DOM 참조를 제공합니다.
다음 예제는 이전 예제와 동일하지만 DOM 참조 기능을 이용하여 다시 구현한 것입니다.
차이점을 비교해 보세요.

```html
<div class="container">
    <div class="alert alert-success" role="alert" data-ref="alert">문제가 발생했습니다.</div>
    <button type="button" class="btn btn-toggle">Toggle</button>
</div>
```

```javascript
Woowahan.View.create('Foo', {
  template: Template,
  events: {
    'click .btn-toggle': 'onToggleElement'
  },

  onToggleElement(event) {
    this.$(this.refs.alert).toggle();
  }
});
```

뷰에서 참조할 data-ref 속성을 템플릿에 기술하면 this.refs 객체에 할당되어 DOM 로딩 후 언제든 해당 엘리먼트에 접근할 수 있습니다.
이제 UI 변경과 상관없이 뷰는 정상 동작이 보장되는 느슨한 결합도를 갖게 되었습니다.

## 폼 요소 참조하기 및 복원

data-ref 속성은 어떤 DOM 요소라도 가능합니다.
FORM 컨트롤들은 다른 요소들과 다르게 사용자의 입력을 처리합니다.
입력된 값들은 뷰 코드가 수집하기 전에 updateView 호출로 뷰가 새로 랜더링되면 모두 유실됩니다.
참조로 명시된 폼 요소 중 몇 몇 타입들은 (INPUT:text, INPUT:number, TEXTAREA) 사용자가 입력한 값들을 updateView에 의해 뷰가 새로 랜더링되어도 값을 유지할 수 있는 옵션을 제공합니다.

```html
<div class="container">
    <input type="text" name="keyword" data-ref="keyword" data-ref-form-restore="true">
    <button type="submit" class="btn btn-default">Submit</button>
    <button type="button" class="btn btn-reset">Reset</button>
</div>
```

```javascript
Woowahan.View.create('Foo', {
  template: Template,
  events: {
    'click .btn-reset': 'onReset'
  },

  onReset(event) {
    this.updateView();    
  }
});
```

위 예제 코드는 Reset 버튼을 클릭하여 뷰를 새로 랜더링 해도 사용자가 입력한 TEXT 값을 유지되는 것을 보여줍니다.
