export const LogMiddleware = function() {
  this.mwtype = 'router';
  this.features = ['params', 'query'];

  this.before = function(feature) {
    console.log('router middleware');
  };
};

export const DebugMiddleware = function() {
  this.mwtype = 'view';
  this.features = [];

  this.after = function(view, dom) {
    console.log('view middleware');
  };
};