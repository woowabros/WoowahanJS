'use strict';

module.exports = function (element, value) {
  $(element).prop('checked', !!value);
};