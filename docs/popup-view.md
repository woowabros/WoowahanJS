# 팝업 뷰<small>PopupView</small>


팝업 뷰는 `Woowahan`에서 제공하는 뷰 컴포넌트입니다.
[뷰](./view.md)<small>View</small>의 기능을 기반으로 팝업 형태로 View를 사용하기 위한 기능들을 제공합니다.
아래는 기본적인 팝업 뷰의 형태입니다.

#### basic-popup-view.hbs

```handlebars
<h1>How old are you?</h1>
<time>{{today}}</time>
<input id="txt-age" type="text">
<button id="btn-submit"></button>
```

#### basic-popup-view.js

```javascript
import Woowahan from 'woowahan';
import Template from 'basic-popup-view.hbs';

export default Woowahan.PopupView.create('BasicPopupView', {
  tagName: 'div',
  className: 'popup',
  template: Template,
  
  events: {
    '@click #btn-submit': 'onClickSubmit(#txt-age)'
  },
  
  onClickSubmit(age) {
    this.closePopup({ age });
  }
});
```

## 팝업 추가

뷰에서는 `addPopup` 메소드를 사용하여 팝업 뷰를 추가할 수 있습니다.
`addPopup` 메소드의 첫번째 인자는 필수로 `PopupView`를 전달해야 합니다.
팝업에 전달할 데이터는 두번째 인자로 전달합니다.
팝업 뷰는 전달된 데이터를 `getModel` 메소드로 참조할 수 있습니다.
세 번째 인자(전달할 데이터가 없다면 두 번째 인자)는 팝업이 닫히고 난 뒤에 실행할 콜백 함수를 전달합니다.

#### basic-view.js

```javascript
import Woowahan from 'woowahan';
import BasicPopupView from './basic-popup-view';

export default Woowahan.View.create('BasicView', {
  template: '<button id="btn-age">age</button>',
  events: {
    'click #btn-age': 'onClickAge'
  },
  
  onClickAge() {
    this.addPopup(BasicPopupView, { today: '2016-12-25' }, ({ age }) => {
      alert(`${age} years old!`);
    });
  }
});
```

## 팝업 제거

팝업 뷰의 `closePopup` 메소드를 호출하면 팝업 뷰가 닫힙니다.
팝업 뷰 내에서 자신을 제거하려면 `this.closePopup`을 호출합니다.

## 데이터 전달

자식 뷰는 `closePopup` 메소드의 인자로 데이터를 부모 뷰로 전달할 수 있습니다.
부모 뷰는 `addPopup` 메소드의 콜백 함수에서 인자로 데이터를 전달받습니다.


## 팝업 스타일 적용

팝업 뷰는 [뷰](./view.md)의 기본 기능 이외에 `css`, `overlayCss`, `showOverlay` 어트리뷰트를 가질 수 있습니다.

- `css`: 팝업 뷰에 적용할 스타일입니다. 팝업 뷰의 기본 스타일에 추가됩니다.
- `overlayCss`: 팝업 뷰의 오버레이에 적용할 스타일입니다. 팝업 뷰 오버레이의 기본 스타일에 추가됩니다.
- `showOverlay`: 오버레이를 노출할지 여부입니다. `true` | `false` 값을 가집니다.

오버레이가 클릭된 경우 팝업 뷰는 `overlayClicked` 이벤트를 발생시킵니다. 오버레이 영역을 클릭하는 경우에 팝업을 제거하는 처리를 손 쉽게 할 수 있습니다.

팝업을 띄우는 뷰에서 `addPopup` 메소드의 두번째 인자로 전달하는 데이터에 `css`, `overlayCss`, `showOverlay` 어트리뷰트를 추가하여 팝업 뷰의 형태를 변경할 수 있습니다.