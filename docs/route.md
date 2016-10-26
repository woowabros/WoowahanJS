# Route

어플리케이션인 `app = Woowahan()`을 start 함으로서 전체 앱을 구동시킬 수 있습니다.
start의 첫 번째 파라메터는 라우팅 경로와 연결될 View의 구성 정보로 이루어진 객체를 받습니다.

```javascript
app.start({
  url: '/',
  view: MainView,
  container: 'body',
  pages: [
    { url: 'users', container: '.contents', view: UserView },
    { url: 'orders', container: '.contents', view: OrderView, pages: [
        { url: ':orderno', view: OrderDetailView, pages: [
            { url: 'edit', view: OrderEditView }
          ]
        },
        { url: 'search', view: OrderSearchView }
      ]
    }
  ]
});
```

위와 같은 앱의 라우팅 경로 구성은 다음과 같이 됩니다.

* / => MainView
* /users => UserView
* /orders => OrderView
* /orders/10 => OrderDetailView
* /orders/10/edit => OrderEditView
* /orders/search => OrderSearchView

## 뷰에서 라우트 경로 얻기

어플리케이션이 라우트 테이블 기준으로 동작시키는 뷰 이외에도 개별 뷰 컴포넌트에서 특정 라우트 경로로 이동해야하는 경우가 있습니다.
모든 뷰에는 `this.getRouteTables` 메소드가 제공되며 이 메소드를 이용하여 app.start에 기술된 모든 라이트 경로를 얻을 수 있습니다.

## getRouteTables

메소드의 사용 방법은 다음과 같습니다.

```javascript
/*
 * getRouteTables (ViewName [,Params][,QueryString])
 */

// UserView의 경로를 얻습니다.
this.getRouteTables('UserView'); /* '/users' 문자열 반환 */

// OrderDetailView의 경로 반환
this.getRouteTables('OrderDetailView', { orderno: 3 }); /* '/orders/3' 문자열 반환 */
// 배열을 이용한 방법. 이 경우 URL에 기술된 Params Key 순서와 입력된 배열의 순서가 일치해야 합니다.
this.getRouteTables('OrderDetailView', [3]); /* '/orders/3' 문자열 반환 */

// OrderSearchView의 경로 반환. QueryString 포함
this.getRouteTables('OrderSearchView', 'keyword=1234'); /* '/orders/search?keyword=1234' 문자열 반환 */
// params 가 있는 경우
this.getRouteTables('OrderSearchView', [], 'keyword=1234');
this.getRouteTables('OrderSearchView', {}, 'keyword=1234');

// 모든 경로 목록 얻기
let tables = this.getRouteTables();

// OrderDetailView 경로 얻기
tables.OrderDetailView({ orderno: 3}); /* '/orders/3' 문자열 반환 */
```

라우트 경로를 얻기위해 필수적인 키는 뷰 이름이 이용됩니다.
뷰 이름은 `Woowahan.View.create` 함수의 첫 번째 인수입니다.
그러나 라우트 테이블에 뷰를 연결할 때 뷰 이름과 다른 이름을 지정할 수 있습니다.
이 때는 뷰 이름을 알기위해 뷰 본체의 내용을 확인해야하는 번거로움이 발생합니다. 라우트 테이블 정의시 외부 참조용으로 뷰 이름의 Alias를 제공하며 다음과 같이 작성됩니다.

```javascript
 app.start({
   url: '/',
   view: MainView,
   container: 'body',
   pages: [
     { url: 'users', container: '.contents', view: UserView, routeName: 'UsersView' },
     { url: 'orders', container: '.contents', view: OrderView, routeName: 'OrdersView', pages: [
         { url: ':orderno', view: OrderDetailView, pages: [
             { url: 'edit', view: OrderEditView }
           ]
         },
         { url: 'search', view: OrderSearchView }
       ]
     }
   ]
 });
 ```

routeName은 getRouteTables 호출의 키 로서 사용되며 기술하지 않으면 View 이름을 기본값으로 사용합니다.
