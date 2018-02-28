/*
 * inject css/js, for client and server, also support inject css/js array or code
 * with special scene,you can mapper tansform css/js url
  // usage
  const inject = require('./inject') 
  // console.log(inject)
  inject.css(`
    body{
      background: #20a0ff;
    }
  `)
  .js('https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js',function(){alert('jQuery is injected!')})
  .js(`
    [].forEach.call(document.querySelectorAll("*"), function(a) {
      a.style.outline = "1px solid #" + (~~(Math.random() * (1 << 24))).toString(16)
    });
  `);
 */
var isClient = typeof window != 'undefined'
var md5 = require('blueimp-md5') // http://www.bootcdn.cn/blueimp-md5/

function asyncCallBack(cb){
  setTimeout(function() {
    typeof cb == 'function' ? asyncCallBack(cb) : ''
  }, 100);
}


function createServerCSS(did, src, cb){
  if (src.indexOf('http')==0 || src.indexOf('/')==0) {
    this.staticList.css[did] = '<link id="'+did+'" rel="stylesheet" type="text/css" href="'+src+'">\n'
  }
  else {
    this.staticList.css[did] = '<style type="text/css" id="'+did+'">'+src.toString()+'</style>\n'
  }
  if (typeof cb == 'function') {
    asyncCallBack(cb)
  }
}

function createServerJS(did, src, cb){
  if (src.indexOf('http')==0 || src.indexOf('/')==0) {
    this.staticList.js[did] = '<script type="text/javascript" id="'+did+'" src="'+src+'"></script>\n'
  }
  else {
    this.staticList.js[did] = '<script type="text/javascript" id="'+did+'" >'+src.toString()+'</script>\n'
  }
  if (typeof cb == 'function') {
    asyncCallBack(cb)
  }
}

function createFileCSS(id, src, cb){
  if(document.getElementById(id)) return true;

  var doc = document
  var headElement = doc.getElementsByTagName("head")[0];

  var tmpLink = doc.createElement('link');
  tmpLink.onload = tmpLink.onreadystatechange = function(){
    if( ! this.readyState || this.readyState=='loaded' || this.readyState=='complete' ){
      asyncCallBack(cb)
    }
  }

  if (src.lastIndexOf('.css')==-1) src += '.css'
  tmpLink.setAttribute("rel", 'stylesheet');
  tmpLink.setAttribute("href", src);
  tmpLink.setAttribute("id", id);
  headElement.appendChild(tmpLink);
}

function createInnerCSS(id, cssCode, cb){
  var doc = document
  var headElement = doc.getElementsByTagName("head")[0];
  
  // css source
  if (! +"\v1") { // IE add opacity compatible mixins
    var t = cssCode.match(/opacity:(\d?\.\d+);/);
    if (t != null) cssCode = cssCode.replace(t[0], "filter:alpha(opacity=" + parseFloat(t[1]) * 100 + ")")
  }

  cssCode = cssCode + "\n"; // add newlines, for console view
  var tempStyleElement = doc.createElement('style'); // w3c
  tempStyleElement.setAttribute("rel", "stylesheet");
  tempStyleElement.setAttribute("type", "text/css");
  tempStyleElement.setAttribute("id", id);
  headElement.appendChild(tempStyleElement);

  var styleElement = tempStyleElement;
  var media = styleElement.getAttribute("media");
  if (media != null && !/screen/.test(media.toLowerCase())) {
    styleElement.setAttribute("media", "screen");
  }
  if (styleElement.styleSheet) {    // IE
    styleElement.styleSheet.cssText += cssCode;
  } else if (doc.getBoxObjectFor) {
    styleElement.innerHTML += cssCode; // FireFox broswer
  } else {
    styleElement.appendChild(doc.createTextNode(cssCode))
  }
  asyncCallBack(cb)
}

function createFileJS(id, src, cb){
  var headElement = document.getElementsByTagName("head")[0];

  var scripter = document.createElement('script');
  scripter.setAttribute("type", 'text/javascript');
  scripter.setAttribute("id", id);

  scripter.onload = scripter.onreadystatechange = function(){
    if( ! this.readyState || this.readyState=='loaded' || this.readyState=='complete' ){
      asyncCallBack(cb)
    }
  }
  scripter.setAttribute("src", src);
  headElement.appendChild(scripter);

  asyncCallBack(cb)
}

function createInnerJS(id, jsCode, cb){
  var headElement = document.getElementsByTagName("head")[0];

  var scripter = document.createElement('script');
  scripter.setAttribute("type", 'text/javascript');
  scripter.setAttribute("id", id);

  scripter.appendChild(document.createTextNode(jsCode))
  headElement.appendChild(scripter);
  asyncCallBack(cb)
}

function injectCSS(id, src, cb){
  if (src.indexOf('http')==0 || src.indexOf('/')==0) {
    return createFileCSS(id, src, cb)
  } else {
    createInnerCSS(id, src, cb)
  }
}

function injectJS(id, src, cb){
  if (src.indexOf('http')==0 || src.indexOf('/')==0) {
    return createFileJS(id, src, cb)
  } else {
    createInnerJS(id, src, cb)
  }
}

// injector constructor
function injectBuilder(){
  this.init()
}

injectBuilder.prototype = {
  init: function(){
    this.staticList = {
      js: {}, css: {}
    }
    return this
  },

  _js: function(src, cb){
    if (src) {
      var $id = md5(src).slice(22)
      if (!isClient) {
        return createServerJS.call(this, $id, src, cb)
      } else {
        var $el = document.getElementById($id)
        if ($el) {
          asyncCallBack(cb)
        } else {
          injectJS($id, src, cb)
        }
      }
    } else {
      asyncCallBack(cb)
    }
  },

  _css: function(src, cb){
    if (src) {
      var $id = md5(src).slice(22)
      if (!isClient) {
        return createServerCSS.call(this, $id, src, cb)
      } else {
        var $el = document.getElementById($id)
        if ($el) {
          asyncCallBack(cb)
        } else {
          injectCSS($id, src, cb)
        }
      }
    } else {
      asyncCallBack(cb)
    }
  },

  js: function(src, cb){
    if (typeof src == 'string') {
      this._js(src, cb)
    }

    if (src && Array.isArray(src)) {
      var that = this
      if (src.length) {
        if (src.length == 1) {
          that._js(src[0], function(){
            src.shift()
            typeof cb == 'function' ? asyncCallBack(cb) : ''
          })
        } else {
          that._js(src[0], function(){
            src.shift()
            that.js(src, cb)
          })
        }
      }
    }
    return this
  },

  css: function(src, cb){
    if (typeof src == 'string') {
      this._css(src, cb)
    }

    if (src && Array.isArray(src)) {
      var that = this
      if (src.length) {
        if (src.length == 1) {
          that._css(src[0], function(){
            src.shift()
            typeof cb == 'function' ? asyncCallBack(cb) : ''
          })
        } else {
          that._css(src[0], function(){
            src.shift()
            that.css(src, cb)
          })
        }
      }
    }
    return this
  }
}

// module.exports = new injectBuilder()
var injectInstance = null; //singleton models
if(!injectInstance){
  injectInstance = new injectBuilder()
}
module.exports = injectInstance