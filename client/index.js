module.exports = {
  //阻止右键及复制保存,
  preventCopy: function(selector) {
    selector = selector ? selector : 'body';
    $(selector).on('contextmenu selectstart dragstart', function(e) {
      e.preventDefault();
      e.returnValue = false;
    })
  },
  //计算字节长度,双字节字符[^\x00-\xff]
  getStrLength: function(value) {
    return value.replace(/[^\x00-\xff]/g, "aa").length; //将双字节字符替换为单字节字符
  },
  //'use strict'模式下匿名函数this指向undefined，否则指向window
  isStrict: function() {
    return (function() {
      console.log("严格模式:" + !this);
      return !this;
    })()
  },
  createUniqueStr: function() {
    var timestamp = +new Date() + '';
    var randomNum = ~~((1 + Math.random()) * (1 << 16)) + '';
    return (+(randomNum + timestamp)).toString(32);
  },
  createRandomColor: function() {
    //R,G,B可取值在0~255,当前设定在128~255
    var R = Math.random() * 127 + 128,
      G = Math.random() * 127 + 128,
      B = Math.random() * 127 + 128;
    return '#' + (R << 16 | G << 8 | B).toString(16);
  },
  //直接控制台输入common.debugCSS()
  debugCSS: function() {
    //$$("*")[控制台私有方法]等价于document.querySelectorAll("*")或jQuery("*")
    [].forEach.call(document.querySelectorAll("*"), function(a) {
      a.style.outline = "1px solid #" + (~~(Math.random() * (1 << 24))).toString(16)
    }); //或者这样：Math.random().toString(16).substr(-7, 6);
  },
  openWindow: function(url, title, w, h) {
    var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    if (window.focus) {
      newWindow.focus();
    }
  },
  //图片上传前 js压缩，files：图片input上传对象数组，回调函数返回base64编码数组，scale_base:宽、高最小尺寸,k:压缩系数
    // 去掉base64标记后 src = src.replace(/^data:image\/(png|jpg|jpeg);base64,/, "") 可以用ajax提交到后台，提交后可以直接存byte[] Image
    imgCompress: function(files, callback, kb, scale_base, k) {
      kb = kb ? kb : 300; //当图片大小大于kb时才进行压缩(单位kb)
      scale_base = scale_base ? scale_base : 1000; //宽、高最小尺寸,默认1000,等比缩放
      k = k ? k : 0.9; //压缩系数,默认0.9
      var srcs = []; //返回的base64编码数组
      var canvas = document.getElementById('imgCompressCanvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'imgCompressCanvas';
      }
      var ctx = canvas.getContext('2d'); //获取2d编辑容器
      var img_cache = document.createElement("img");
      //var img_cache = new Image();//创建一个图片

      var tmpFile, i = 0;
      var compress = function() {
        if (i >= files.length) {
          callback(srcs);
          return;
        }
        var reader = new FileReader();
        tmpFile = files[i];
        reader.readAsDataURL(tmpFile);
        reader.onload = function(e) {
          img_cache.src = e.target.result;
          img_cache.onload = function() {
            var m;
            if (tmpFile.size > kb * 1024) {
              if (img_cache.width > img_cache.height) {
                m = img_cache.width / img_cache.height;
                canvas.height = scale_base;
                canvas.width = scale_base * m;
              } else {
                m = img_cache.height / img_cache.width;
                canvas.height = scale_base * m;
                canvas.width = scale_base;
              }
            } else {
              canvas.height = img_cache.height;
              canvas.width = img_cache.width;
            }

            ctx.drawImage(img_cache, 0, 0, canvas.width, canvas.height);

            srcs.push(canvas.toDataURL("image/jpeg", k));
            i++;
            compress();
          }
        }
      };
      compress();
    },
    //转意符换成普通字符
    escape2Html: function(str) {
      var arrEntities = {
        'lt': '<',
        'gt': '>',
        'nbsp': ' ',
        'amp': '&',
        'quot': '"',
        '#39': "'"
      };
      return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
        return arrEntities[t];
      });
    },
    // &nbsp;转成空格
    nbsp2Space: function(str) {
      var arrEntities = {
        'nbsp': ' '
      };
      return str.replace(/&(nbsp);/ig, function(all, t) {
        return arrEntities[t];
      });
    },
    getIeVersion: function() {
      var retVal = -1,
        ua, re;
      if (navigator.appName === 'Microsoft Internet Explorer') {
        ua = navigator.userAgent;
        re = new RegExp('MSIE ([0-9]{1,})');
        if (re.exec(ua) !== null) {
          retVal = parseInt(RegExp.$1);
        }
      }
      return retVal;
    },
    isIE: function(){
      var isIE
      if (typeof navigator !== 'undefined') {
        isIE = navigator.userAgent.match(/Trident/) ||
          navigator.userAgent.match(/Edge/)
      }
      return isIE
    },
    //将毫秒数times转换为-天-时-分-秒
    getTime: function(times) {
      var day = times / (1000 * 3600 * 24);
      var cache1 = times % (1000 * 3600 * 24);
      var hour = times / (1000 * 3600);
      var cache2 = cache1 % (1000 * 3600);
      var minute = cache2 / (1000 * 60);
      var cache3 = cache2 % (1000 * 60);
      var second = cache3 / 1000;
      return {
        day: Math.ceil(day),
        hour: parseInt(hour) < 10 ? '0' + parseInt(hour) : '' + parseInt(hour),
        minute: parseInt(minute) < 10 ? '0' + parseInt(minute) : '' + parseInt(minute),
        second: parseInt(second) < 10 ? '0' + parseInt(second) : '' + parseInt(second)
      }
    },
    //获取当前滚动位置,用于跳转到其他页面后在返回时恢复跳转前的状态
    getPageScroll: function() {
      var x = 0,
        y = 0;
      if (window.pageYOffset) { // all except IE
        y = window.pageYOffset;
        x = window.pageXOffset;
      } else if (document.documentElement && document.documentElement.scrollTop) { // IE 6 Strict
        y = document.documentElement.scrollTop;
        x = document.documentElement.scrollLeft;
      } else if (document.body) { // all other IE
        y = document.body.scrollTop;
        x = document.body.scrollLeft;
      }
      return {
        x: x,
        y: y
      };
    },
}