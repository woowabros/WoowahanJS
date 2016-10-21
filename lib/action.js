'use strict';

module.exports = {
  create: function create(type) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return {
      wwtype: 'action',
      type: type,
      data: data
    };
  }
};