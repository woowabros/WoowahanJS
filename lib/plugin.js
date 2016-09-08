'use strict';

module.exports = {
  create: function create(type, plugin) {
    return {
      wwtype: 'plugin',
      type: type,
      plugin: plugin
    };
  }
};