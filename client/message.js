const $ = require('jquery')
const layer = require('layer')

module.exports = {
  //信息框，必须参数:content:内容；可选参数:title:标题；yesfunc:确定回调；option:自定义配置
  alert: function(content, title, yesfunc, option) {
    option = $.extend(true, {
      offset: 'auto', //可设置'auto'居中
      title: title == "" ? false : [
        title ? title : "提示",
        "background-color:#20A0FF; color:white;" //标题样式
      ],
      btn: ["确定"]
    }, option);
    var index = layer.alert(content, option, yesfunc);
    return index;
  },
  //询问框,必须参数:content:内容；yesfunc:确定回调；可选参数:cancelfunc:取消回调；option:自定义配置
  confirm: function(content, yesfunc, cancelfunc, option) {
    option = $.extend(true, {
      offset: 'auto', //可设置'auto'居中
      shadeClose: false,
      title: [
        "确认",
        "background-color:#20A0FF; color:white;" //标题样式
      ],
      content: content,
      btn: ["确定", "取消"]
    }, option);
    var index = layer.confirm(content, option, yesfunc, cancelfunc);
    return index;
  },
  //提示框,必须参数:content:内容；可选参数:state:(0|1|2|3|4|5|6)，依次是(!|√|×|？|密码锁(权限不够)|哭脸(失败)|笑脸(成功))
  msg: function(content, state, time, endfunc) {
    var index = layer.msg(content, {
      offset: 'auto', //可设置'auto'居中
      icon: state ? state : 0, //设置默认"!"
      time: time ? time : 2000 //2秒后关闭（layer默认是3秒）
    }, endfunc);
    return index;
  },
  //tips框,必须参数:content:内容，selector:选择器；可选参数:color:背景颜色，direction:(1|2|3|4),依次(上|右|下|左),方向会智能选择，一般不用设置
  tips: function(content, selector, color, time, direction) {
    var index = layer.tips(content, selector, {
      tips: [direction ? direction : 2, color ? color : "#20A0FF"],
      time: time ? time : 2000 //2秒后关闭（layer默认是3秒）
    });
    return index;
  },
  //显示PC端loading
  showLoading: function() {
    var index = layer.load(2, { //0-2三种类型
      shade: [0.3, '#fff'] //带透明度的背景
    });
    return index;
  }
}