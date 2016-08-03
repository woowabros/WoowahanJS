'use strict';

module.exports = function (name, view) {
  return {
    view: view,
    name: name,
    viewName: view.viewname,
    wwtype: 'component'
  };
};