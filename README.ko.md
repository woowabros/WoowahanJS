# WoowahanJS

WoowahanJS는 보다 큰 규모의 웹 어플리케이션 개발을 위한 프레임워크입니다.

현대의 웹 어플리케이션은 많은 수의 컴포넌트로 복잡하게 구성된 뷰와 상태를 관리하는 HTTP 기반 클라이언트 어플리케이션 입니다.
일정 규모 이상의 웹 어플리케이션을 개발하기 위해선 다양한 디자이너, 퍼블리셔 및 프로그래머가 협업해야 합니다.
WoowahanJS는 퍼블리셔와 프로그래머간 협업이 쉬운 환경을 제공합니다.

빠르고 생산성 높은 UI 작업을 위해 계층 뷰 컴포넌트 관리와 One-way data binding을 지원하며 UI와 비즈니스 코드간 종속성을 최소화 하기 위한 아키텍처로 설계되었습니다.

## 영향을 받은 것들

WoowahanJS는 유명한 [BackboneJS](http://backbonejs.org) 기반 위에서 작성되었습니다. [BackboneJS](http://backbonejs.org)는 [UnderscoreJS](http://underscorejs.org), [jQuery](http://jquery.com) 종속성을 포함하므로 WoowahanJS도 자연스럽게 언제든 [UnderscoreJS](http://underscorejs.org)와 [jQuery](http://jquery.com)를 사용할 수 있습니다.

API 호출에서 촉발되는 상태 흐름과 관리를 위해 [React](https://facebook.github.io/react/) 프로젝트의 [Flux](https://facebook.github.io/flux) 및 [Redux](http://redux.js.org) 아키텍처의 아이디어를 구현했습니다. 하지만 WoowahanJS를 사용하기 위해 이들을 선행학습 할 필요는 없습니다.

## 빠르게 시작하기

저장소를 Clone 한 뒤 [Example](./examples) 디렉토리의 셈플들을 살펴보세요. WoowahanJS를 가장 빠르게 시작할 수 있는 지름길입니다.

## 설치

```
$ mkdir hello-woowa && cd hello-woowa
$ npm init
$ npm install --save woowahan
```

## Hello, WoowahanJS

```Javascript
import Woowahan from 'woowahan';

const Main = Woowahan.View.create('Main', {
  template: '<h1>Hello, WoowahanJs</h1>'
});

const app = Woowahan();

app.start({
  url: '/', container: 'body', view: Main
});
```

다음 링크에서 더 많은 정보를 제공합니다.

* [WoowahanJS 시작하기](./docs/README.md)