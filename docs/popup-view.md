# 팝업 뷰

팝업 뷰<sub>PopupView</sub>는 `Woowahan`에서 제공하는 뷰 컴포넌트입니다.
[뷰]('./view.md')<sub>View</sub>의 기능들을 상속하며, 팝업 뷰를 나타내기 위한 기능들을 제공합니다.

아래는 기본적인 팝업 뷰의 형태입니다.

#### basic-popup-view.js

```javascript
import Woowahan from 'woowahan';
import Template from './basic-popup-view.hbs';

export default Woowahan.PopupView.create('BasicPopupView', {
  template: Template,
  css: { background: '#000' },
  overlayCss: { background: '#FFF' },
  className: 'basic-popup',
  overlayClassName: 'basic-popup-overlay',
  showOverlay: true,
  
  viewDidMount() {
    this.overlay.css({ background: '#FF0000' });
  }
});
```

## overlay

오버레이<sub>overlay</sub>는 팝업 뷰의 뒤로 나타나는 딤드<sub>dimmed</sub> 영역입니다.

팝업 뷰에서는 `overlay` 속성을 통해 이 영역에 접근할 수 있습니다.
`jQuery` 객체로 제공되므로 `jQuery` 기능을 사용하여 자유롭게 제어가능합니다.

## css

팝업 뷰는 기본 `css`를 가지고 있습니다.
`css` 속성으로 추가한 스타일이 기본 `css`를 덮어쓰는 형태로 적용됩니다.

> 기본 css 속성들

> overflowY: 'auto'

> display: 'block'

> position: 'absolute'

> top: '50%'

> left: '50%'

> width: '80%'

> maxHeight: '80%'

> background: '#fff'

> webkitTransform: 'translate(-50%, -50%)'

> transform: 'translate(-50%, -50%)'

> zIndex: 1100

## overlayCss

팝업 뷰의 오버레이는 기본 `css`를 가지고 있습니다.
`overlayCss` 속성으로 추가한 스타일들이 기본 `css`를 덮어쓰는 형태로 적용됩니다.

> 오버레이의 기본 css 속성들

> position: 'fixed'

> top: 0

> left: 0

> right: 0

> bottom: 0

> background: '#000'

> opacity: 0.7

> zIndex: 1000

## overlayClassName

`overlayClassName` 속성을 통해 오버레이에 `className`을 추가할 수 있습니다.

## showOverlay

`showOverlay` 속성을 통해 오버레이를 노출할지 여부를 설정할 수 있습니다.

## closePopup

`closePopup` 메소드를 호출하여 팝업 뷰를 닫을 수 있습니다.
팝업 뷰 스스로 닫는 경우는 `this.closePopup()` 형태로 호출할 수 있습니다.

`closePopup` 메소드의 인자로 데이터를 전달할 수도 있습니다. [참고](./view.md#팝업-뷰)

## overlayClicked 이벤트

오버레이가 클릭되는 경우 `overlayClicked` 이벤트가 발생합니다.
`overlayClick` 이벤트를 수신하여 팝업 뷰 외부가 클릭되는 이벤트를 수신할 수 있습니다.

```javascript
export default Woowahan.PopupView.create('BasicPopupView', {
  events: {
    'overlayClicked': 'onOverlayClick'
  },
  
  onOverlayClick() {
    console.log('overlay clicked');
    
    this.closePopup();
  }
});
```