# WoowahanJS

WoowahanJS is a framework for developing larger web applications.

Modern web applications are HTTP-based client applications that manage complex views and states with a large number of components. In order to develop web applications over a certain size, various designers, publishers, and programmers need to collaborate. WoowahanJS provides an easy environment for collaboration between publishers and programmers.

It supports hierarchical view component management and one-way data binding for fast and productive UI operations and is designed as an architecture to minimize the dependency between UI and business code.

## Affected ones

WoowahanJS was built on the famous [BackboneJS](http://backbonejs.org) base. [BackboneJS](http://backbonejs.org) includes [UnderscoreJS](http://underscorejs.org) and [jQuery](http://jquery.com) dependencies, so WoowahanJS can naturally use UnderscoreJS and jQuery at any time.

We implemented the idea of the [Flux](https://facebook.github.io/flux) and [Redux](http://redux.js.org) architecture of the [React](https://facebook.github.io/react/) project for state flow and management triggered by API calls. However, you do not have to learn these to use WoowahanJS.


## Get started fast

Clone the repository and look at the samples in the [Example](./examples) directory. WoowahanJS is the fastest way to get started.

## Install

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

The following links provide more information.

* [Getting Started with WoowahanJS](./docs/README.md)
