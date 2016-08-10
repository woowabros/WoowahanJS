'use strict';

/*global $ _*/

module.exports = function (element, value) {
  var opts = Array.isArray(value) ? value : [value];

  var selectedIndex = 0;

  $(element).empty();

  opts.forEach(function (opt, index) {
    var label = void 0;
    var val = void 0;

    if (typeof opt === 'string') {
      label = opt;
      val = opt;
    } else {
      label = opt.label;
      val = opt.value;

      if (!!opt.selected) {
        selectedIndex = index;
      }
    }

    $(element).append('<option value="' + val + '">' + label + '</option>');
  });

  $(element).children('option').eq(selectedIndex).attr('selected', 'selected');
  $(element).trigger('change');
};