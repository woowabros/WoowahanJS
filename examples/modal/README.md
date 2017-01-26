# Modal

웹앱 전역에서 사용할 공통 뷰 컴포넌트를 등록하고 사용하는 방법을 볼 수 있습니다. 부트스트랩의 모달 뷰 기능을 사용합니다.

```
npm install

npm run dev
```

[http://localhost:8080/](http://localhost:8080/) 에서 확인 가능합니다.


## 공통뷰 등록방법

```
import ModalViewNormal from './view/modal-view-normal/modal-view-normal';

...

// app.use(Woowahan.Component('공통뷰이름', 공통뷰));
app.use(Woowahan.Component('ModalComponentNormal', ModalViewNormal));

```

## 공통뷰 사용방법

template
```
<button id="btn-modal-normal">NORMAL</button>
```

hello-view.js
```
events: {
  'click #btn-modal-normal': 'onClickModalNormal',
    ...
}

...

initialize() {
  this.modalNormal = null;
  ...
},

onClickModalNormal() {
  if (!!this.modalNormal) return;

  this.onCloseModal();

  const ModalViewNormal = this.getComponent('ModalComponentNormal');
  //this.modalNormal = this.addView('컨테이너' , '뷰이름' , '뷰로 전달 할 데이터')
  this.modalNormal = this.addView('#modal-wrap', ModalViewNormal, { label: '팝업 컨테이너에 추가' });
},
```
