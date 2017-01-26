# Transition

WoowahanJS가 제공하는 메서드가 아닌 view단에서 얼마든지 개발자가 원하는 커스텀메서드를 사용하는 것이 가능합니다.

```
npm install

npm run dev
```

[http://localhost:8080/](http://localhost:8080/) 에서 확인 가능합니다.


## 커스텀 메서드 정의방법(transition 메서드)

base-view.js
```
export const BaseView = Woowahan.View.create('BaseView', {
  ...
  startTransition() {

    ...
    this.dispatch(Woowahan.Event.create('transitionComplete'));
    ...
  }
});
```

BaseView에만 정의된 startTransition 메서드를 정의하고 transition이 완료가 되는 시점에 transitionComplete 이벤트를 생성시킵니다.


## 커스텀 메서드 사용방법(transition 메서드)

main-layout.js
```
...
events: {
  '@viewDidMount': 'onViewMount',
  '@transitionComplete': 'onCompleteTransition'
},

onViewMount(view) {
  this.log(`mount된 view: ${view.viewname}`);

  switch (view.viewname) {
    case 'BaseView':
      view.startTransition();
      break;
  }
},

onCompleteTransition() {
  this.log('transition complete');
}
...
```

MainLayout에 view가 렌더링이 되면 @viewDidMount 를 통해서 onViewMount가 호출고 해당 view에 정의한 startTransition메서드를 호출합니다. transition이 완료가 되면 @transitionComplete 메서드가 호출되면서 onCompleteTransition메서드가 호출이 됩니다.
