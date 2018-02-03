module.exports = {
  setCookie: function(name, value, domain, path, hour) {
    var domainPrefix = window.location.host;
    if (hour) {
      var today = new Date();
      var expire = new Date();
      expire.setTime(today.getTime() + 3600000 * hour);
    }
    window.document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
    return true;
  },
  //获取参数名获取cookie中的参数值
  getCookie: function(name) {
    var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
    var m = window.document.cookie.match(r);
    return (!m ? "" : decodeURIComponent(decodeURI(m[1])));
  },
  removeCookie: function(name, domain, path) {
    var domainPrefix = window.location.host;
    window.document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
  },
}