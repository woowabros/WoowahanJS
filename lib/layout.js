'use strict';

module.exports = function (container, view, options) {
  return {
    view: view,
    container: container,
    options: Object.assign({ update: true }, options),
    viewName: view.viewname,
    wwtype: 'layout'
  };
};