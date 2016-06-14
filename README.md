# WoowahanJS

WoowahanJS는 BackboneJS를 기반으로 작성된 SPA 앱 개발용 웹프레임워크입니다.

## 환경

프로젝트를 빌드 하기 위해선 다음의 구성요소가 개발자의 PC에 미리 설치되어 있어야합니다

* node.js

## 설치

```
$ git clone https://github.com/woowabros/WoowahanJS.git myapp
$ cd myapp && npm install
$ gulp build
```

## 실행

보일러플레이트로 제공된 웹앱용 서버를 실행시킵니다. (default http://localhost:4000)
```
$ npm run demo-server
```

## 프록시 서버 실행

SPA 웹앱 개발시 도메인이 다른 API 서버에 요청을 할 수 없습니다. 이 때 요청이 가능하도록 proxy-server를 제공합니다. 프록시 서버는 server/proxy.js 에 있습니다. API 서버의 End-point 에 맞게 수정하여 사용하시기 바랍니다.
```
$ npm run proxy-server
```


