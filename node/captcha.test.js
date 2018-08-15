
const Captcha = require('./captcha')


let captcha = new Captcha()

let fac = captcha.get()

fs.writeFile('captcha.png',fac.buffer,(err)=>{
  if(err){
    console.log('生成验证码错误')
  }else{
    console.log('生成验证码成功: ' + fac.text)
  }
})

// module.exports = Captcha;
