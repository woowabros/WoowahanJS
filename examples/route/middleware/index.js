export const AppMiddleware = function(test) {
  console.log('AppMiddleware called');

  this.mwtype = 'app';

  if (test !== 'test') throw new Error('AppMiddleware 인자 에러');

  this.before = function(app, next) {
    console.log('AppMiddleware before called');

    if (typeof app !== 'object' || typeof next !== 'function') throw new Error('AppMiddleware before 인자 에러');
    if (Backbone.History.started) throw new Error('AppMiddleware before 발동 시점 에러');

    app.beforeTested = false;

    setTimeout(function() {
      app.beforeTested = true;

      next();
    }, 1000);
  };

  this.after = function(app, next) {
    console.log('AppMiddleware after called');

    if (typeof app !== 'object' || typeof next !== 'function') throw new Error('AppMiddleware after 인자 에러');
    if (!app.beforeTested) throw new Error('AppMiddleware after 발동 시점 에러');

    next();
  };
};

export const ViewMiddleware = function(test) {
  console.log('ViewMiddleware called');

  this.mwtype = 'view';

  if (test !== 'test') throw new Error('ViewMiddleware 인자 에러');

  this.before = function(app, next) {
    console.log('ViewMiddleware before called');

    if (typeof app !== 'object' || typeof next !== 'function') throw new Error('ViewMiddleware before 인자 에러');

    next();
  };

  this.after = function(view, next) {
    console.log('ViewMiddleware after called');

    if (typeof view !== 'object' || typeof next !== 'function') throw new Error('ViewMiddleware after 인자 에러');
    if (view.$el.html() === '') throw new Error('ViewMiddleware after 발동 시점 에러');

    next();
  };

  this.unmount = function(view, next) {
    console.log('ViewMiddleware unmount called');

    if (typeof view !== 'object' || typeof next !== 'function') throw new Error('ViewMiddleware unmout 인자 에러');
    if (view.$el.html() === '') throw new Error('ViewMiddleware unmount 발동 시점 에러');

    setTimeout(function() {
      if (!view || view.$el.html() === '') throw new Error('ViewMiddleware unmount 발동 시점 에러');

      next();
    }, 1000);
  };
};

export const ReducerMiddleware = function(test) {
  console.log('ReducerMiddleware called');

  this.mwtype = 'reducer';

  if (test !== 'test') throw new Error('ReducerMiddleware 인자 에러');

  this.before = function(settings, app, next) {
    console.log('ReducerMiddleware before called');

    if (typeof app !== 'object' || typeof next !== 'function') throw new Error('ReducerMiddleware before 인자 에러');

    next();
  };

  this.after = function(app, next) {
    console.log('ReducerMiddleware after called');

    if (typeof app !== 'object' || typeof next !== 'function') throw new Error('ReducerMiddleware after 인자 에러');

    next();
  };
};

export const RouterMiddlewarePre = function() {
  console.log('RouterMiddlewarePre called');

  this.mwtype = 'router';

  this.before = function(route, app) {
    console.log('RouterMiddlewarePre before called');
  };

  this.after = function(route, app) {
    console.log('RouterMiddlewarePre after called');
  };
};

export const RouterMiddleware = function(test) {
  console.log('RouterMiddleware called');

  this.mwtype = 'router';

  if (test !== 'test') throw new Error('RouterMiddleware 인자 에러');

  this.before = function(route, app, next) {
    console.log('RouterMiddleware before called');

    if (typeof app !== 'object' || typeof next !== 'function') throw new Error('RouterMiddleware before 인자 에러');

    next();
  };

  this.after = function(route, app, next) {
    console.log('RouterMiddleware after called');

    if (typeof app !== 'object' || typeof next !== 'function') throw new Error('RouterMiddleware after 인자 에러');

    next();
  };
};