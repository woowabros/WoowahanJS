# 컬렉션 뷰

컬렉션 뷰<sub>CollectionView</sub>는 `Woowahan`에서 제공하는 뷰 컴포넌트입니다.
[뷰]('./view.md)<sub>View</sub>의 기능들을 상속하며, 컬렉션 데이터를 나타내기 위한 기능들을 제공합니다

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

컬렉션 데이터를 뷰 모델로 가지는 아이템 뷰<sub>ItemView</sub>입니다.

## reload

컬렉션 뷰의 `reload` 메소드의 인자로 컬렉션 데이터를 전달하면 뷰 리스트가 자동으로 갱신됩니다.  
`reload` 메소드를 통해 전달된 컬렉션 데이터는 컬렉션 뷰의 내부에서 이전에 전달된 컬렉션 데이터와 비교를 통해 필요한 `row`만 추가, 삭제, 변경합니다.  
`reload` 메소드는 두 번째 인자로 옵션 객체를 받을 수 있으며, 옵션 객체의 구성은 아래와 같습니다.
 
- `uid` : 컬렉션 뷰 내부에서 `row`를 비교하기 위한 기준이 되는 속성명입니다.
- `reset`: 기존 `row`를 제거할지 여부를 설정합니다. 기본 값은 `true`입니다.
- `reverse`: `row`를 아래에서 위로 추가할 수 있는 옵션입니다. 기본 값은 `false`입니다.

```javascript
// phoneNumber 속성을 기준으로, 새로 전달된 collectionData에 없는 기존 row는 제거 되며 row는 아래에서 위로 추가됩니다
this.reload(collectionData, { uid: 'phoneNumber', reset: true, reverse: true });
````

## getCollection

컬렉션 뷰의 `getCollection` 메소드를 통해 현재 컬렉션 데이터를 `JSON` 형태로 가져올 수 있습니다.