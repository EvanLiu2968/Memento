const fs = require('fs');
const qrcode = require('./generateQRCode');

qrcode('www.evanliu2968.com.cn', {
  margin: 1,
  width: 500,
  scale: 4,
  color: {
    dark: '#00ff00ff', //6位颜色+2位明度，支持3位、4位、6位、8位
    light: '#ffffffff',
  },
  // type: 'png',
  // rendererOpts: {
  //   quality: 0.3,
  //   width: 200,
  //   height: 200,
  // }
}).then((data)=>{
  data = data.replace(/^(data:image\/(png|jpg|jpeg);base64,)/,'')
  fs.writeFile('qrcode.png',new Buffer(data,'base64'),(err)=>{
    if(err){
      console.log('生成二维码错误')
    }else{
      console.log('生成二维码成功')
    }
  })
})