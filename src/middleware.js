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

    const featuresLen = params.length;

    let index = 0;

    const next = function() {
      const curr = middlewares[index++];

      if (curr) {
        const middleware = curr[protocol];

        if (middleware.length > featuresLen) {
          middleware.call(curr, ...params, next);
        } else {
          middleware.call(curr, ...params);

          setTimeout(next, 1);
        }
      } else {
        !!callback && callback();
      }
    };

    next();
  }
};