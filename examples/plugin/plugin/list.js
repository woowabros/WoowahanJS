module.exports = function(element, value) {
  let domStr = '';
  if(typeof value === 'undefined') {
      domStr += '<li></li>'
  }else {
    for (const item of value) {
      domStr += `<li data-target="${item.value}">${item.label}</li>`;
    }
  }
  $(element).html(domStr);
};
