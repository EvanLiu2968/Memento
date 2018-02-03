module.exports = {
  //下载图片,下载完成后进行回调
  loadImage: function(url, callback, data) {
    var img = new Image(); //创建一个Image对象，实现图片的预下载
    img.src = url;
    img.data = data;
    if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
      callback.call(img);
      return; // 直接返回，不用再处理onload事件
    }
    img.onload = function() { //图片下载完毕时异步调用callback函数。
      callback.call(img); //将回调函数的this替换为Image对象
    };
  },
}