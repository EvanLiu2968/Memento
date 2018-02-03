module.exports = {
  //是否是移动端
  isMobile: function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(navigator.userAgent);
  },
  //是否是微信,(还可判断是否存在WeixinJSBridge,需在WeixinJSBridgeReady事件后)
  isWechat: function() {
    return /micromessenger/i.test(navigator.userAgent) || typeof navigator.wxuserAgent !== 'undefined';
  },
  //是否是手Q
  isMobileQQ: function() {
    return /MQQBrowser/i.test(navigator.userAgent);
  },
  //IP地址
  isIP: function(value) {
    return /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(value);
  },
  //身份证
  isIdCardNo: function(value) {
    var birthday = new Date(value.substr(6, 4) + "-" + value.substr(10, 2) + "-" + value.substr(12, 2)); //不考虑15位身份证，目前有效身份证均为18位
    return /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/.test(value) && (birthday < new Date());
  },
  //车牌号
  isPlateNo: function(value) {
    return /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test(value);
  },
  //手机号
  isMobile: function() {
    var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    return mobile.test(value);
  },
  //电话号码
  isTel: function() {
    var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
    return tel.test(value);
  },
  //QQ号码
  isQQ: function(value) {
    return /^[1-9]\d{4,10}$/.test(value);
  },
  //字母开头，长度在6-12之间，只能包含字符、数字和下划线的密码,按需修改。
  isPassword: function(value) {
    return /^[a-zA-Z]\w{5,12}$/.test(value);
  },
  //一个或多个中文
  isChinese: function(value) {
    return /^[\u4e00-\u9fa5]+$/.test(value);
  },
  //网址
  isUrl: function(value) {
    return /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i.test(value)
  },
  isEmail: function(value) {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
  },
}