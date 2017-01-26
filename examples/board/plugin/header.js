module.exports = function(element, value) {
  let domStr = '';
  console.log(value)
  if(typeof value === 'undefined' || value === false) {
    domStr += '<ul class="nav navbar-nav"></ul>'
  }else {
    domStr += '<ul class="nav navbar-nav"><li><a href="#/posts">게시글</a></li></ul>';
    domStr += '<ul class="nav navbar-nav navbar-right" data-role="bind" data-name="isLogin" data-type="navUserInfo">';
    domStr += '<li><a id="logout" href="#">LOGOUT</a></li></ul>';
  }
  $(element).html(domStr);
};