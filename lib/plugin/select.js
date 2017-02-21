'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*global $ _*/

module.exports = function (element, value) {
  var selectedIndex = 0;
  var opts = void 0;

  if (Array.isArray(value)) {
    if (!value.length) {
      return;
    } else {
      opts = Array.from(value);
    }
  } else {
    if (typeof value === 'undefined') {
      return;
    } else {
      opts = Array.from([value]);
    }
  }

  element.innerHTML = '';

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = opts.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var index = _step$value[0];
      var opt = _step$value[1];

      var label = void 0,
          val = void 0;

      if (typeof opt === 'string') {
        label = opt;
        val = opt;
      } else {
        label = opt.label;
        val = opt.value;
      }

      if (!!opt.selected) {
        selectedIndex = index;
      }

      $(element).append('<option value="' + val + '">' + label + '</option>');
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  $(element).children('option').eq(selectedIndex).attr('selected', 'selected');
  $(element).trigger('change');
};