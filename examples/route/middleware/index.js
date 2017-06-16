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

export const TimeoutMiddleware = function() {
  this.mwtype = 'reducer';
  this.features = ['timeout'];

  this.before = function(feature) {
    feature.timeout = 10000;
  };
};