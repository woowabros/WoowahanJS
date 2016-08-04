/*global $*/

module.exports = function(element, value) {
  const opts = Array.isArray(value) ? value : [value];

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
    }

    $(element).append(`<option value="${val}"${index == 0 ? ' selected' : ''}>${text}</option>`);
  });
};