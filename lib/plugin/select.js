'use strict';

/*global $*/

module.exports = function (element, value) {
  var opts = Array.isArray(value) ? value : [value];

  $(element).empty();

  opts.forEach(function (opt, index) {
    var text = void 0;
    var val = void 0;

    if (typeof opt === 'string') {
      text = opt;
      val = opt;
    } else {
      text = opt.text;
      val = opt.value;
    }

    $(element).append('<option value="' + val + '"' + (index == 0 ? ' selected' : '') + '>' + text + '</option>');
  });
};