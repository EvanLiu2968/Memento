
const qrcode = require('qrcode');
const _ = require('lodash');

function generateQRCode(href,config){
  config=_.merge({
    // version: 7,                      // Calculated QR Code version (1 - 40) 版本越高点数越多越密，容纳数据越多
    // errorCorrectionLevel: 'Q',       // Error Correction Level [choices: "L", "M", "Q", "H"]
    // maskPattern: 4                   // Calculated Mask pattern (0 - 7)
  },config)
  // 可用于浏览器端和node端
  return new Promise((resolve,reject)=>{ 
    qrcode.toDataURL(href, config , function (err, url) {
      if(err){
        reject(err)
      }
      resolve(url) //返回 data:image/png;base64,...
    })
  })
}

module.exports = generateQRCode