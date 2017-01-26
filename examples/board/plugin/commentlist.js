module.exports = function(element, value) {
  let domStr = '';
  if(typeof value === 'undefined') {
      domStr += '<li></li>'
  }else {
    value.forEach(function(ele, idx){
      domStr += `<li>`;
      domStr += '<strong>'+ (ele.name + ' _ <span> '+ele.email+' </spam>') +'</strong><br/>';
      domStr += ele.body;
      domStr += `</li>`;
    });
  }
  $(element).html(domStr);
};
