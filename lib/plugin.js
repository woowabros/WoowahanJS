'use strict';

module.exports = function (type, plugin) {
  return {
    type: type,
    plugin: plugin,
    wwtype: 'plugin'
  };
};