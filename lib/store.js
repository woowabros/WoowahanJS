'use strict';

module.exports = {
  create: function create(states) {
    return {
      wwtype: 'store',
      store: states
    };
  }
};