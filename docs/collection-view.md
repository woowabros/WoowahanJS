# 컬렉션 뷰

컬렉션 뷰<small>Collection View</small>는 Woowahan에서 제공하는 확장 컴포넌트입니다.
[뷰](./view.md)<small>View</small>의 기능을 상속하며 리스트 형태로 View를 사용하기 위한 확장 기능들을 제공합니다.
아래는 기본적인 컬렉션 뷰의 형태입니다.

컬렉션 뷰는 [뷰](./view.md)의 기본 기능 이외에 `rowContainer`, `rowView` 어트리뷰트를 가질 수 있습니다.

- `rowContainer`: 리스트를 추가할 컨테이너입니다.
- `rowView`: 리스트의 아이템이 될 뷰 컴포넌트입니다. `ItemView`를 상속하여 생성합니다.

컬렉션 뷰의 `reload` 메소드로 리스트 데이터를 전달하면 `ItemView`로 리스트를 구성합니다.

## 리스트 추가 & 갱신



## 아이템 뷰

아이템 뷰를 컨테이너에 추가합니다.

## 이벤트 처리

#### collection-view.js

```javascript
import Woowahan from 'woowahan';
import Template from 'collection-view.hbs';

export default Woowahan.CollectionView.create('CollectionView', {
  tagName: 'div',
  className: 'main light',
  template: Template,
  
  events: {
    'click #how-old-are-you': 'onHowOldAreYou'
  },
  
  initialize() {
    this.setModel({
      people:[{
          firstName: '길동',
          lastName: '홍',
          age: 573},
        {
          firstName: '순신',
          lastName: '이',
          age: 3000
        },
        {
          firstName: ''
        }
      ]
    });
    
    this.super();
  },
  
  viewWillMount(renderData) {
    this.log(renderData);
    
    return renderData;
  },
  
  viewDidMount($el) {
  
  },
  
  viewWillUnmount() {
  
  },
  
  onHowOldAreYou() {
    alert(this.getModel('age'));
  }
});
```