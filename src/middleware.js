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

const queue = [];

let _isRunning = false;

export const MiddlewareRunner = {
  get isRunning() {
    return _isRunning;
  },
  run(middlewares, protocol, params, callback, preprocess) {
    if (!Array.isArray(middlewares) || typeof protocol !== 'string') throw new Error('MiddlewareRunner arguments error');

    if (_isRunning) {
      queue.push([middlewares, protocol, params, callback, preprocess]);

      return;
    }

    _isRunning = true;

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
        _isRunning = false;

        !!callback && callback();

        const task = queue.shift();

        if (!!task) {
          MiddlewareRunner.run(...task);
        }
      }
    };

    if (typeof preprocess === 'function') preprocess();

    next();
  }
};