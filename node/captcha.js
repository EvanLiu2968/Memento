var ccap = require('ccap')
var fs = require('fs')

module.exports = class Captcha {
  constructor(opts){
    var options = {
      width:150,
      height:50,
      offset:30,
      quality:100,
      fontsize:46,
      length: 4
    }
    if(opts){
      options = Object.assign(options,opts);
    }
    this.options = options;
  }
  randomString(length) {
    length = length || 6;
    // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    var charsPool = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var str = '';
    for (let i = 0; i < length; i++) {
      str += charsPool.charAt(Math.floor(Math.random() * charsPool.length));
    }
    return str;
  }
  get(){
    this.options.generate = () => {
      return this.randomString( this.options.length );
    }
    var factory = ccap( this.options );
    var array = factory.get()
    return {
      text: array[0],
      buffer: array[1]
    }
  }
}