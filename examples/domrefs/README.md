# Dom Refs

WoowahanJS가 제공하는 DOM참조 방법입니다.

```
npm install

npm run dev
```

[http://localhost:8080/](http://localhost:8080/) 에서 확인 가능합니다.

## 돔 참조방법

data-ref : 돔의 id또는 class를 기반으로 해당 돔을 접근하는 경우 돔에 의존성을 가집니다. 예를들여 스타일링등을 이유로 class, id 이름이 변경되는 경우 더이상 값을 참조할수가 없게 됩니다.
data-ref를 통해 의존성을 낮췄습니다.

```
<div class="alert alert-success" role="alert" data-ref="alertMessage">입력합 값을 검증해보세요.</div>
```
위의 alert를 접근하는 경우 jQuery를 사용하는 경우 아래와 같습니다.
```
$('.alert').toggle();
```

woowahanjs의 경우에는 다음과 같이 돔에 접근합니다.
```
$(this.refs.alertMessage).toggle();
```

this.refs를 통해서 해당 돔에 접근을 합니다.

data-ref-form-restore="true" : updateView() 일때 값 유지
