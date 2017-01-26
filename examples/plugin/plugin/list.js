module.exports = function(element, value) {
  let domStr = '';

  for (const item of value) {
    domStr += `<li data-target="${item.value}">${item.label}</li>`;
  }

  $(element).html(domStr);
};