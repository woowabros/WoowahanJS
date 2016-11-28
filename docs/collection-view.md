# 컬렉션 뷰

컬렉션 뷰~CollectionView~는 `Woowahan`에서 제공하는 뷰 컴포넌트입니다.
[뷰]('./view.md)~View~의 기능들을 상속하며, 컬렉션 데이터를 나타내기 위한 기능들을 제공합니다

아래는 기본적인 컬렉션 뷰의 형태입니다.

#### basic-collection-view.js

```javascript
import Woowahan from 'woowahan';
import BasicItemView from './basic-item-view';
import Template from './basic-collection-view.hbs';

export default Woowahan.CollectionView.create('BasicCollectionView', {
  template: Template,
  rowView: BasicItemView,
  rowContainer: '#basicContainer',
  
  viewDidMount() {
    const collectionData = [
      { name: '홍길동', age: 573 },
      { name: '이순신', age: 534 },
      // ...
    ];
    
    this.reload(collectionData);
  }
});
```

## rowContainer

컬렉션 데이터의 뷰를 추가할 컨테이너입니다.
     
## rowView

컬렉션 데이터를 뷰 모델로 가지는 아이템 뷰~ItemView~입니다.

## reload

컬렉션 뷰의 `reload` 메소드의 인자로 컬렉션 데이터를 전달하면 뷰 리스트가 자동으로 갱신됩니다.

## getCollection

컬렉션 뷰의 `getCollection` 메소드를 통해 현재 컬렉션 데이터를 가져올 수 있습니다.