// 直接控制台输入debugCSS()
window.debugCSS = function() {
  // $$("*")[控制台私有方法]等价于document.querySelectorAll("*")或jQuery("*")
  [].forEach.call(document.querySelectorAll('*'), function(a) {
    a.style.outline = '1px solid #' + (~~(Math.random() * (1 << 24))).toString(16)
  }) // 或者这样：Math.random().toString(16).substr(-7, 6);
}
window.openWindow = function(url, title, w, h) {
  var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
  var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

  var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
  var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

  var left = ((width / 2) - (w / 2)) + dualScreenLeft
  var top = ((height / 2) - (h / 2)) + dualScreenTop
  var newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

  if (window.focus) {
    newWindow.focus()
  }
}