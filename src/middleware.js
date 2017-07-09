export const MIDDLEWARE = {
  APP: 'app',
  VIEW: 'view',
  REDUCER: 'reducer',
  ROUTER: 'router',
};

export const MIDDLEWARE_PROTOCOL = {
  BEFORE: 'before',
  AFTER: 'after',
  UNMOUNT: 'unmount',
};

export const MiddlewareRunner = {
  run(middlewares, protocol, params, callback) {
    if (!Array.isArray(middlewares) || typeof protocol !== 'string') throw new Error('MiddlewareRunner arguments error');

    let index = 0;

    const next = function() {
      const curr = middlewares[index++];

      if (curr) {
        curr[protocol].call(null, ...params, next);
      } else {
        !!callback && callback();
      }
    };

    next();
  }
};