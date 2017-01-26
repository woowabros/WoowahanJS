# Plugin(재사용 가능한 UI조각)

WoowahanJS에 주입가능한 플러그인 작성법입니다.

WoowahanJS에서  plugin이란 재사용가능한 컴퍼넌트정의를 말합니다.

```
npm install

npm run dev
```

[http://localhost:8080/](http://localhost:8080/) 에서 확인 가능합니다.

## 플러그인 등록방법
plugin > 원하는 이름의 플러그인 추가(ex. list.js)

plugin/list.js
```
module.exports = function(element, value) {
  ...
};

```

해당 플러그인이 하는 행동을 코드로 구현합니다.

main.js
```
import ListPlugin from './plugin/list';

...
// app.use(Woowahan.Plugin('플러그인 이름', '플러그인'));
app.use(Woowahan.Plugin('list', ListPlugin));

```
구현한 플러그인을 use를 사용해서 Woowahan에 주입합니다.

## 플러그인 사용법

```
<ul data-role="bind" data-name="listData" data-type="list"></ul>
```
data-role: bind<br/>
data-name: 모델에 정의된 데이터 키값<br/>
data-type: 플러그인 이름, 아래에 정의한 list
```
app.use(Woowahan.Plugin('list', ListPlugin));
```

해당 데이터를 기반으로 해당 list 플러그인이 동작합니다.
