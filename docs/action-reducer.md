# 액션과 리듀서

UI 관련 코드와 상태(데이타) 및 상태 관리 코드는 분리시킬 수 있는 방법이 필요하며 이를 위해 Action & Reducer 아키텍처를 제공합니다. Action은 특정 작업을 시작하게하는 "키"로서 정의되며 연결된 Reducer 와 1:1 관계로 구성됩니다. 

Action을 Reducer에 전달하기 위해서 dispatch를 제공하며 어떤 View 에서도 호출할 수 있습니다.

## 액션

앤션은 다음과 같은 모양을 가집니다.

```Javascript
{
  type: 'ActionName',
  data: {
  
  }
}
```

액션을 보낼 때 손쉽게 만들 수 있는 유틸리티 함수를 제공하며 다음과 같으 간편하게 사용할 수 있습니다.

```Javascript
Woowahan.Action.create('ActionName', data);
```

## Dispatch

모든 뷰는 this.dispatch 기능을 제공합니다. dispatch로 액션을 보낼 수 있으며 액션의 수행 결과를 받을 핸들러를 지정할 수 있습니다. 핸들러가 없는 액션이 있을 수 도 있기 때문에 핸들러는 옵션입니다. 다음과 같이 사용할 수 있습니다.

```Javascript
onReceive(data) {

}

onAction(data) {
  this.dispatch(Woowahan.Action.create('SearchOrders', data), this.onReceive);
}
```

## 리듀서

