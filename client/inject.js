var path = require('path')
var md5 = require('blueimp-md5')

/*
 * 动态插入style到head，并带有简单的兼容效果
 * 接入参数模式
 * 1、 addSheet(['csscode','ele_id'])
 * 2、 addSheet(element, ['csscode','ele_id'])
*/
var mapper //静态资源映射文件
function matchMapper(src, type){
  src = src.replace(/\-/g, '/')
  switch (type) {
    case 'css':
      var _src = src.replace('/css/', '').replace('.css', '')
      if (mapper.pageCss[_src]) return '/css/'+mapper.pageCss[_src]
      break;
    case 'js':
      var _src = src.replace('/js/', '').replace('.js', '')
      if (mapper.pageJs[_src]) return '/js/'+mapper.pageJs[_src]
      break;
  }
}

// 生成css引用
function createLink(doc, headElement, id, cssCode){
  var tmpLink = doc.createElement('link');
  tmpLink.onload = tmpLink.onreadystatechange = function(){
    if( ! this.readyState || this.readyState=='loaded' || this.readyState=='complete' ){
      SAX.setter(id, 'finish');
    }
  }
  tmpLink.setAttribute("rel", 'stylesheet');
  if (!path.extname(cssCode)) cssCode +='.css'
  tmpLink.setAttribute("href", cssCode);
  tmpLink.setAttribute("id", id);
  headElement.appendChild(tmpLink);
}

function createCssInnerSource(doc, headElement, id, cssCode){
  // css source
  if (! +"\v1") { // ie 增加自动转换透明度功能，用户只需输入W3C的透明样式，它会自动转换成IE的透明滤镜
    var t = cssCode.match(/opacity:(\d?\.\d+);/);
    if (t != null) cssCode = cssCode.replace(t[0], "filter:alpha(opacity=" + parseFloat(t[1]) * 100 + ")")
  }
  cssCode = cssCode + "\n"; //增加末尾的换行符，方便在firebug下的查看。
  var styleElements = headElement.getElementsByTagName("style");
  var tempStyleElement = doc.createElement('style'); //w3c
  tempStyleElement.setAttribute("rel", "stylesheet");
  tempStyleElement.setAttribute("type", "text/css");
  tempStyleElement.setAttribute("id", id);
  headElement.appendChild(tempStyleElement);
  var styleElement = tempStyleElement;
  var media = styleElement.getAttribute("media");
  if (media != null && !/screen/.test(media.toLowerCase())) {
    styleElement.setAttribute("media", "screen");
  }
  if (styleElement.styleSheet) {    //ie
    styleElement.styleSheet.cssText += cssCode;
  } else if (doc.getBoxObjectFor) {
    styleElement.innerHTML += cssCode; //火狐支持直接innerHTML添加样式表字串
  } else {
    styleElement.appendChild(doc.createTextNode(cssCode))
  }
}

// 生成js引用或者inner code
function createScript(doc, headElement, id, src, cb){
  if(document.getElementById(id)){
    if (cb && typeof cb==='function') cb()
    return;
  }

  var scripter = document.createElement('script');
  scripter.onload = scripter.onreadystatechange = function(){
    if( ! this.readyState || this.readyState=='loaded' || this.readyState=='complete' ){
      SAX.setter(id, 'finish');
      if (typeof cb==='function') cb()
    }
  }
  scripter.setAttribute("type", 'text/javascript');
  scripter.setAttribute("id", id);
  if (src.indexOf('http')===0 || src.indexOf('/')===0){
    if (!path.extname(src)) src +='.js'
    scripter.setAttribute("src", src);
    headElement.appendChild(scripter);
  }
  else{
    scripter.appendChild(document.createTextNode(src))
    headElement.appendChild(scripter);
  }
  return true;
}

function _inject() {
  var doc, tmpCssCode, tmpSrcCode, srcCode, cssCode, id;
  var type, _cb;
  doc = this;
  if (!doc.createElement){
    console.log('不能动态插入静态文件，请指定正确的文档');
    return false
  }
  if (arguments.length === 1) tmpSrcCode = tmpCssCode = arguments[0]
  else if (arguments.length === 2) {
    type = arguments[0];
    tmpSrcCode = tmpCssCode = arguments[1];
  } else if (arguments.length === 3){
    type = arguments[0];
    tmpSrcCode = tmpCssCode = arguments[1];
    _cb  = arguments[2]
  } else {
    return false;  // alert("addSheet函数最多接受3个参数!");
  }

  var headElement = doc.getElementsByTagName("head")[0];
  if(Array.isArray(tmpSrcCode)){
    id = tmpSrcCode[1];
    srcCode = cssCode = tmpSrcCode[0];
  }
  if (!type || type==='css'){
    // css referer
    if(document.getElementById(id)) return;
    if(cssCode.indexOf('http')===0){
      return createLink(doc, headElement, id, cssCode)
    } else if (cssCode.indexOf('/')===0) {
      if (cssCode.indexOf('/css/t/')>-1 || cssCode.indexOf('/js/t/')>-1) return createLink(doc, headElement, id, cssCode)
      var target = matchMapper(cssCode, 'css')
      if (target) return createLink(doc, headElement, id, target)
    }
    return createCssInnerSource(doc, headElement, id, cssCode)
  }
  else if (type==='js'){
    if(srcCode.indexOf('http')===0) {
      return createScript(doc, headElement, id, srcCode, _cb)
    } else if (srcCode.indexOf('/')===0) {
      if (srcCode.indexOf('/css/t/')>-1 || srcCode.indexOf('/js/t/')>-1) return createScript(doc, headElement, id, srcCode, _cb)
      var target = matchMapper(srcCode, 'js')
      if (target) return createScript(doc, headElement, id, srcCode, _cb)
    } else{
      srcCode = srcCode + "\n"; //增加末尾的换行符，方便在firebug下的查看。
      return createScript(doc, headElement, id, srcCode, _cb)
    }
  }
}


// 动态注入js或者css
// window.onload后促发，不影响首屏显示
function _initInject(type, src, cb){
  var that = this
  var args, _thirdPartJs = SAX.get('thirdPartJs')||{};
  if (!type || (typeof type==='object' && !type.concat)) type = 'css'

  if (Array.isArray(type)){
    args = type;  type = 'css';
    if (typeof src === 'function'){
      cb = src
      src = undefined
    }
  }
  if (typeof src == 'string') src = [src]
  if (Array.isArray(src)) args = src
  if (args){
    var did = md5(args[0]).slice(22)
    if (args.length===1) args.push(did)
    // if (type=='js'){
    //   if (_thirdPartJs[did] === 'finish'){
    //     if (that._config.reload){
    //       var _child = document.getElementById(did);
    //         _child.parentNode.removeChild(_child);
    //       delete _thirdPartJs[did];
    //     } else {
    //       if (typeof cb==='function') cb();
    //       return true;
    //     }
    //   }
    // }

    if (_thirdPartJs[did] === 'finish'){
      if (that._config.reload){
        var _child = document.getElementById(did);
          _child.parentNode.removeChild(_child);
        delete _thirdPartJs[did];
      } else {
        if (typeof cb==='function') setTimeout(cb, 30)
        return true;
      }
    }

    if (_thirdPartJs[did] === 'loadding'){
      if (typeof cb==='function') {
        SAX.set(did, null, cb)
      }
      return true;
    }

    // 注入js文件
    _thirdPartJs[did] = 'loadding';
    SAX.append('thirdPartJs', _thirdPartJs);
    if (typeof args[0]==='string' && ( args[0].indexOf('http')===0 || args[0].indexOf('/')===0)){
      SAX.set(did, null, [function(){
        var _tmp = {};
        _tmp[did] = 'finish'
        SAX.append('thirdPartJs', _tmp);
        SAX.deleter(did)
      }])
    }
    this.loadStaic(this.doc, args, type, cb)
  }
}

function dealInject(doc){
  if (!doc) doc = document;
  this.mapper
  this.mapperStat
  this.doc = doc
  this.stack = []
  var that = this

  this.demand = function(){
    if (this.stack.length) {
      this.stack.map((item)=>{
        item()
      })
    }
  }

  this.getMapper = function(){
    if (this.mapperStat) return
    this.mapperStat = 'loadding'
    $.get('/mapper')
    .then( data => {
      mapper = data
      this.mapper = data
      this.mapperStat = 'finish'
      this.demand()
    })
  }

  this.loadStaic = function(doc, args, type, cb){
    if (type){
      if (args) _inject.call(doc, type, args, cb)
      if (type === 'css'){
        if (typeof cb==='function') setTimeout(cb, 30)
      }
    } else{
      if (args) _inject.call(doc, args)
    }
    // setTimeout(function(){
    // },17)
  }

  this._config = {
    reload: false   //重新注入文件
  }

  this.css = function(src, cb){
    let that = this
    if (this.mapper) {
      _initInject.call(this, 'css', src, cb)
    } else {
      this.getMapper()
      this.stack.push(function(){
        _initInject.call(that, 'css', src, cb)
      })
    }
    return this
  }

  this.js = function(src, opts, cb){
    if (typeof opts==='function') cb = opts;
    if (opts && opts.reload) this._config.reload = opts.reload
    let that = this
    if (this.mapper) {
      _initInject.call(this, 'js', src, cb)
    } else {
      this.getMapper()
      this.stack.push(function(){
        _initInject.call(that, 'js', src, cb)
      })
    }
    return this
  }
}

// libs.inject()
// .js(['/js/t/epic/js/epiceditor.js'], initEpicEditor)
// .css(['/css/t/simplemde.css'])
var injInstance
function inject(doc){
  if (injInstance) return injInstance
  injInstance = new dealInject(doc)
  return injInstance
}

function addSheet(){
  return _inject
}

module.exports = inject
