# 액션과 리듀서

UI 관련 코드와 상태(데이타) 및 상태 관리 코드를 분리하기 위해 Action & Reducer를 제공합니다.
Action은 특정 작업을 시작하게하는 "키"로서 정의되며 Reducer와 1:1 관계를 가집니다.
Action을 Reducer에 전달하기 위해서 dispatch를 제공하며 어떤 View에서도 호출할 수 있습니다.

## 액션

액션의 형태는 다음과 같습니다.

```javascript
{
  type: 'ActionName',
  data: {

  }
}
```

액션을 쉽게 만들 수 있는 Action Creator 유틸리티를 제공합니다.
dispatch에 전달된 액션 객체를 직접 기술할 수도 있으나 Action Creator를 사용하면 좀 더 편리합니다.

```javascript
Woowahan.Action.create('ActionName', data);
```

## Dispatch

모든 뷰는 dispatch를 제공합니다. dispatch로 액션을 보낼 수 있으며 액션의 수행 결과는 지정한 핸들러를 통해 받을 수 있습니다.
핸들러가 없는 액션이 있을 수도 있기 때문에 핸들러는 옵션입니다.
다음과 같이 사용할 수 있습니다.

```javascript
onReceive(data) {

}

onAction(data) {
  this.dispatch(Woowahan.Action.create('SearchOrders', data), this.onReceive);
}
```

## 리듀서

Reducer Creator로 리듀서를 만들 수 있습니다.
리듀서는 액션과 달리 반드시 Reducer Creator로만 만들 수 있습니다.

WoowahanJS에서 리듀서의 역할은 약속된 액션의 작업을 처리하는 작업 처리자입니다.
웹 어플리케이션에서 작업 처리자가 처리해야할 주된 작업 중 하나는 API 호출과 관련되어있습니다.
Ajax로 대변되는 XHR 처리는 리듀서가 담당하며 보다 효과적인 처리를 위해 몇 가지 헬퍼 함수가 제공됩니다.

사용자 정보 API를 호출한 후 결과를 반환하는 전형적인 코드는 다음과 같습니다.

```javascript
const FETCH_USER_INFO = 'fetch-user-info';

Woowahan.Reducer.create(FETCH_USER_INFO, function(data) {
  this.onSuccess = function(response) {
    this.finish(response);
  };

  this.getData('/api/users/'+data.userid);
});
```

getData는 GET XHR 요청을 보내는 함수이며 첫 번째 인자로 URL을 받습니다.
HTTP 메소드 타입에 대응하는 postData, putData, deleteData가 제공됩니다.
XHR 요청이 완료되면 this.onSuccess로 결과 값이 반환됩니다.
응답 처리를 위해 onSuccess 구현은 필수 요소입니다.

요청 실패시 필요한 작업이 있다면 onFail을 구현하면 됩니다.
onFail이 구현되지 않았다면 WoowahanJS 는 error 이벤트를 글로벌 이벤트로 생성합니다.
글로벌 이벤트는 어플리케이션 이벤트라 부르며 이벤트 부분에서 자세한 내용을 알 수 있습니다.

리듀서의 처리 결과를 dispatch한 핸들러에 보내기 위해 **finish** 메소드가 제공됩니다.
리듀서 내에서 언제든 finish 메소드를 호출함으로서 리듀서 수행을 종료하고 결과를 dispatch시 지정된 핸들러로 전송할 수 있습니다.

## 리듀서 등록

만들어진 리듀서가 사용되기 위해선 등록 과정이 필요합니다.
리듀서 등록은 어플리케이션이 처리합니다.

```javascript
import Woowahan from 'woowahan';
import FetchUserReducer from './reducer/fetch-user';

let app = new Woowahan();

app.use(FetchUserReducer);

app.start();
```

이제 어떤 뷰에서든 dispatch를 통하여 FetchUserReducer를 이용할 수 있습니다.

## 스키마
