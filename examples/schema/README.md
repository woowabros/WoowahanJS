# Schema

Reducer를 통해 API 호출할 때 전달되는 데이터를 클라이언트에서 선 검증을 가능하게 갑니다.
예제는 액션의 메세지의 구조를 정의하고 데이타를 검증하는 Schema 기능의 간단한 예제입니다.

```
npm install

npm run dev
```

[http://localhost:8080/](http://localhost:8080/) 에서 확인 가능합니다.

## Schema 정의하기

main.js
```
...
// Woowahan.Schema.create('스키마 이름', 스키마 속성)

var joinSchema = Woowahan.Schema.create('JoinSchema', {
  id:     Woowahan.Types.String({ required: true, min: 4, max: 20 }),
  name:   Woowahan.Types.String({ required: true, max: 30 }),
  email:  Woowahan.Types.Email({ required: true })
});
...
```

## Schema 사용방법

main.js
```
...

// Schema정의
var joinSchema = Woowahan.Schema.create('JoinSchema', {
  id:     Woowahan.Types.String({ required: true, min: 4, max: 20 }),
  name:   Woowahan.Types.String({ required: true, max: 30 }),
  email:  Woowahan.Types.Email({ required: true })
});

// Reducer정의 및 등록
var myTask = Woowahan.Reducer.create('save-user-profile', joinSchema, function (data) {
  this.finish(data);
});

app.use(myTask);

...
```

hello-view.hbs

```
<form>
  ...
  <button type="submit" class="btn btn-default" data-action="save">Save</button>
</form>
```

hello-view.js

```
...
events: {
  '@submit form': 'onSave(#id, #name, #email)'
},
...

onSave(id, name, email, inputs) {
  this.dispatch(Woowahan.Action.create('save-user-profile', {
    id: inputs['id'],
    name: inputs['name'],
    email: inputs['email']
  }), this.onCompleteSave);

  return false;
},

onCompleteSave(data) {
  alert('저장 완료');
}
```

등록된 save-user-profile 리듀서를 호출하기 위해서는 동일한 이름의 액션을 생성해야합니다.
```
Woowahan.Action.create('액션이름', 전달할 데이터, callback)
```

dispatch의 경우에는 해당 액션이 완료됨을 받아주는 역활을 합니다. 비동기적인(API호출등) 동작의 응답을 받아주는 역활을 합니다.
