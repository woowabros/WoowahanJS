'use strict';

/*global $*/

module.exports = function (element, value) {
  if (typeof value === 'undefined') value = '';
  $(element).text(value);
};