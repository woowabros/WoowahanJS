'use strict';

module.exports = function (container, view) {
  return {
    view: view,
    container: container,
    viewName: view.viewname,
    wwtype: 'layout'
  };
};