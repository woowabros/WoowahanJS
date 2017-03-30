# hello-yarn

[Yarn](https://yarnpkg.com/) 설치:

```
$ npm install -g yarn
```

개발 도구 설치:

```
$ yarn add --dev webpack webpack-dev-server@2
```

WoowahanJS 설치:

```
$ yarn add woowahan
```

[webpack-dev-server](https://webpack.js.org/guides/development/#webpack-dev-server) 실행:

```
$ yarn run webpack-dev-server
```

또는 `package.json`에 개발 서버를 실행하는 스크립트 추가:

```json
"scripts": { "start": "webpack-dev-server" }
```

```
$ yarn start
```

웹 브라우저로 확인:

```
$ open http://localhost:8080/
```
