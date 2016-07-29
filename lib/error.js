'use strict';

module.exports = {
  create: function create(message, target) {
    return { wwtype: 'error', code: 1, message: message, target: target };
  }
};