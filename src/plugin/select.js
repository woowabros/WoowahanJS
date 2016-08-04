/*global $ _*/

module.exports = function(element, value) {
  const opts = Array.isArray(value) ? value : [value];

  let selectedIndex = 0;

  $(element).empty();

  opts.forEach(function(opt, index) {
    let text;
    let val;

    if (typeof opt === 'string') {
      text = opt;
      val = opt;
    } else {
      text = opt.text;
      val = opt.value;

      if (!!opt.selected) {
        selectedIndex = index;
      }
    }

    $(element).append(`<option value="${val}">${text}</option>`);
  });

  $(element).children('option').eq(selectedIndex).attr('selected', 'selected');
  $(element).trigger('change');
};