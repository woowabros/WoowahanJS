# Popup

페이지를 구조화하고 해당 뷰에서 popup뷰를 사용하는 방법입니다.

```
npm install

npm run dev
```

[http://localhost:8080/](http://localhost:8080/) 에서 확인 가능합니다.


## 페이지 구조화 방법

```
import { MainLayout } from './view/layout/main-layout';
import { BaseView } from './view/component';
...

app.use(Woowahan.Layout('#content', MainLayout));

app.start([
  { url: '/', container: '#mainContent', view: BaseView, layout: 'MainLayout' }
]);
```

### 레이아웃 구조
ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ<br/>
MainLayout
<br/>
ㅡㅡㅡㅡㅡㅡ<br/>
| BaseView |<br/>
ㅡㅡㅡㅡㅡㅡ
<br/>
ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

MainLayout의 특정 돔을 기반으로 뷰가 생성됩니다.

라우팅및 각 라우팅에 대한 뷰를 정의하는 자세한 방법은 [이곳]() 을 확인하시기 바랍니다.

## Popup뷰 사용법

base-view.hbs
```
...
<button data-ref="btnPopup">ADD POPUP</button>
...
```

base-view.js
```
import { PopupView } from './popup-view';
...

events: {
  'click button[data-ref=btnPopup]': 'onClickPopup'
},

onClickPopup() {
  ...

  // this.addPopup('팝업뷰이름', '뷰에 전달할 데이터' , callback)

  this.addPopup(PopupView, { title: '입력해 주세요.' }, function(popupData = {}) {
    if (popupData.action === 'submit') {
      const data = popupData.data;
      const result = Object.keys(data).reduce((prev, key) => ((!!data[key] ? prev.push(data[key]) : prev), prev), []);

      if (!!result.length) {
        this.refs.txtResult.innerText = `입력된 결과는 ${result.join(', ')}입니다.`;
      } else {
        this.refs.txtResult.innerText = '입력된 텍스트가 없습니다.';
      }
    } else {
      this.refs.txtResult.innerText = '입력이 취소되었습니다.';
    }
  });
}


```
