export const AppMiddlewarePre = function() {
  this.mwtype = 'app';

  this.before = function(app) {
    log('[AppMiddlewarePre] before called', 'red');
  };

  this.after = function(app) {
    log('[AppMiddlewarePre] after called', 'red');

    app.setStates({ test: 'test' });
  };
};

export const AppMiddleware = function(test) {
  this.mwtype = 'app';

  if (test !== 'test') throw new Error('AppMiddleware 인자 에러');

  this.before = function(app, next) {
    log('[AppMiddleware] before called', 'red');

    if (typeof app !== 'object' || typeof next !== 'function') throw new Error('AppMiddleware before 인자 에러');
    if (Backbone.History.started) throw new Error('AppMiddleware before 발동 시점 에러');

    const state = app.getStates('test');

    if (state !== 'test') throw new Error('AppMiddleware before app 인자 에러');

    app.beforeTested = false;

    setTimeout(function() {
      app.beforeTested = true;

      next();
    }, 1000);
  };

  this.after = function(app, next) {
    log('[AppMiddleware] after called', 'red');

    if (typeof app !== 'object' || typeof next !== 'function') throw new Error('AppMiddleware after 인자 에러');
    if (!app.beforeTested) throw new Error('AppMiddleware after 발동 시점 에러');

    next();
  };
};

export const ViewMiddleware = function(test) {
  this.mwtype = 'view';

  if (test !== 'test') throw new Error('ViewMiddleware 인자 에러');

  this.before = function(view, next) {
    log('[ViewMiddleware] before called', 'orange');

    if (typeof view !== 'object' || typeof next !== 'function') throw new Error('ViewMiddleware before 인자 에러');

    next();
  };

  this.after = function(view, next) {
    log('[ViewMiddleware] after called', 'orange');

    if (typeof view !== 'object' || typeof next !== 'function') throw new Error('ViewMiddleware after 인자 에러');
    if (view.$el.html() === '') throw new Error('ViewMiddleware after 발동 시점 에러');

    view.$el.append('<p>ViewMiddleware add this text.</p>');
    next();
  };

  this.unmount = function(view, next) {
    log('[ViewMiddleware] unmount called', 'orange');

    if (typeof view !== 'object' || typeof next !== 'function') throw new Error('ViewMiddleware unmout 인자 에러');
    if (view.$el.html() === '') throw new Error('ViewMiddleware unmount 발동 시점 에러');

    setTimeout(function() {
      if (!view || view.$el.html() === '') throw new Error('ViewMiddleware unmount 발동 시점 에러');

      next();
    }, 1000);
  };
};

export const ReducerMiddlewarePre = function() {
  this.mwtype = 'reducer';

  this.before = function(settings) {
    log('[ReducerMiddlewarePre] before called', 'blue');

    settings.timeout = 5000000;
  };
};

export const ReducerMiddleware = function(test) {
  this.mwtype = 'reducer';

  if (test !== 'test') throw new Error('ReducerMiddleware 인자 에러');

  this.before = function(settings, app, next) {
    log('[ReducerMiddleware] before called', 'blue');

    if (typeof app !== 'object' || typeof next !== 'function') throw new Error('ReducerMiddleware before 인자 에러');
    if (settings.timeout !== 5000000) throw new Error('ReducerMiddleware before 인자 에러');

    next();
  };

  this.after = function(app, next) {
    log('[ReducerMiddleware] after called', 'blue');

    if (typeof app !== 'object' || typeof next !== 'function') throw new Error('ReducerMiddleware after 인자 에러');

    next();
  };
};

export const RouterMiddlewarePre = function() {
  this.mwtype = 'router';

  this.before = function(route, app) {
    log('[RouterMiddlewarePre] before called', 'green');
  };

  this.after = function(route, app) {
    log('[RouterMiddlewarePre] after called', 'green');
  };
};

export const RouterMiddleware = function(test) {
  this.mwtype = 'router';

  if (test !== 'test') throw new Error('RouterMiddleware 인자 에러');

  this.before = function(route, app, next) {
    log('[RouterMiddleware] before called', 'green');

    if (typeof app !== 'object' || typeof next !== 'function') throw new Error('RouterMiddleware before 인자 에러');
    if (route.url === 'layout1' && route.routeData.route !== 'good') throw new Error('RouterMiddleware before 인자 에러');

    next();
  };

  this.after = function(route, app, next) {
    log('[RouterMiddleware] after called', 'green');

    if (typeof app !== 'object' || typeof next !== 'function') throw new Error('RouterMiddleware after 인자 에러');

    next();
  };
};