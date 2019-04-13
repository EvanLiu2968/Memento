/*
 * sync模块公用方法,node端和broswer端共用代码
 */

/**
 * 时间转中文更新文字
 * @param {Number} timeStamp 
 * @returns {String} xx分钟前 xx小时前 xx天前 xx周前 xx月前 xx年前
 */
function timeToLastestCn(timeStamp) {
  var date = new Date(timeStamp);
  if (/invalid/i.test(date)) {
    return '暂无数据'
  }
  var result = "刚刚发布";
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var year = month * 12;

  var diffValue = new Date() - date;

  var yearC = diffValue / year;
  var monthC = diffValue / month;
  var halfMonthC = diffValue / (15 * day);
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;

  if (yearC >= 1) {
    result = parseInt(yearC) + "年前发布";
  } else if (monthC >= 1) {
    result = parseInt(monthC) + "月前发布";
  } else if (weekC >= 1) {
    result = parseInt(weekC) + "周前发布";
  } else if (dayC >= 1) {
    result = parseInt(dayC) + "天前发布";
  } else if (hourC >= 1) {
    result = parseInt(hourC) + "小时前发布";
  } else if (minC >= 1) {
    //shelveStatus
    result = "刚刚发布";
  }
  return result;
}

/**
 * 数字转中文
 * @param {Number} num: 阿拉伯数字
 * @returns {String} 中文数字
 */
function numberToChinese(num) {
  var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"]; //单个数字转换
  var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"]; //节权位
  var chnUnitChar = ["", "十", "百", "千"]; //节内权位
  // 节内转换算法
  var sectionToChinese = function (section) {
    var strIns = '', chnStr = '';
    var unitPos = 0;
    var zero = true;
    while (section > 0) {
      var v = section % 10;
      if (v === 0) {
        if (!zero) {
          zero = true;
          chnStr = chnNumChar[v] + chnStr;
        }
      } else {
        zero = false;
        strIns = chnNumChar[v];
        strIns += chnUnitChar[unitPos];
        chnStr = strIns + chnStr;
      }
      unitPos++;
      section = Math.floor(section / 10);
    }
    return chnStr;
  }
  // 主转换算法
  var unitPos = 0;
  var strIns = '', chnStr = '';
  var needZero = false;

  if (num === 0) {
    return chnNumChar[0];
  }

  while (num > 0) {
    var section = num % 10000;
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr;
    }
    strIns = sectionToChinese(section);
    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
    chnStr = strIns + chnStr;
    needZero = (section < 1000) && (section > 0);
    num = Math.floor(num / 10000);
    unitPos++;
  }

  return chnStr;
}
/**
 * 中文转数字
 * @param {String} chnStr: 中文数字
 * @returns {Number} 阿拉伯数字
 */
function chineseToNumber(chnStr) {
  // 中文数字转换
  var chnNumChar = {
    零: 0,
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9
  };
  // 中文权位转换
  var chnNameValue = {
    十: { value: 10, secUnit: false },
    百: { value: 100, secUnit: false },
    千: { value: 1000, secUnit: false },
    万: { value: 10000, secUnit: true },
    亿: { value: 100000000, secUnit: true }
  }

  var rtn = 0;
  var section = 0;
  var number = 0;
  var secUnit = false;
  var str = chnStr.split('');

  for (var i = 0; i < str.length; i++) {
    var num = chnNumChar[str[i]];
    if (typeof num !== 'undefined') {
      number = num;
      if (i === str.length - 1) {
        section += number;
      }
    } else {
      var unit = chnNameValue[str[i]].value;
      secUnit = chnNameValue[str[i]].secUnit;
      if (secUnit) {
        section = (section + number) * unit;
        rtn += section;
        section = 0;
      } else {
        section += (number * unit);
      }
      number = 0;
    }
  }
  return rtn + section;
}


/**
 * textarea文本转换为HTML格式
 * @param {String} text 
 * @returns {String} html
 */
function textToHtml(text) {
  text = text ? text : '';
  var replaceMap = {
    '↵': '<br/>',
    '\r\n': '<br/>',
    '\n': '<br/>',
    // ' ': '&nbsp;'
  };
  return text.replace(/(↵|\r\n|\n)/ig, function (all, t) {
    return replaceMap[t];
  });
}

/**
 * 对文本可能存在的html转义，除了br标签
 * @param {String} text 
 * @returns {String} html
 */
function escapeHtml(text) {
  text = text ? text : '';
  var replaceMap = {
    '<': '&lt;',
    '>': '&gt;'
  };
  text = text.replace(/(<|>)/ig, function (all, t) {
    return replaceMap[t];
  }).replace(/(&lt;br\S?&gt;)/ig, function (all, t) {
    return '<br/>'
  })
  return text
}

/**
 * 对字符串进行Unicode编码
 * @param {String} text 
 * @returns {String} enUnicode
 */
function enUnicode(text) {
  text = text ? text : '';
  let str = '';
  for (var i = 0; i < text.length; i++) {
    str += "\\u" + text.charCodeAt(i).toString(16);
  }
  return str;
}
/**
 * 对字符串进行Unicode解码
 * @param {String} text 
 * @returns {String} deUnicode
 */
function deUnicode(text) {
  // text = '头\u554a\u662f\u7684\u8303\u5fb7尾'
  text = text ? text : '';
  text = text.replace(/(\\u\w+)/ig, function (all, t) {
    t = t.replace('\\u', '')
    return String.fromCharCode(parseInt(t, 16).toString(10))
  })
  return text
}

/**
 * 身份证校验(大陆18位身份证)
 * @param {String} strID: 身份证号码
 * @returns {Boolean}
 */
function isChinaID(strID) {
  // 1到17位相乘系数
  const coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  // 身份证1到17位分别与系数相乘之和
  var count = coefficient.reduce(function (accumulator, value, i) {
    return accumulator + value * parseInt(strID.charAt(i))
  }, 0)
  // console.log('系数相乘之和:'+count)
  // 和数除以11的余数
  var remainder = count % 11
  // console.log('和数除以11的余数:'+remainder)
  // 余数对应身份证第18位的映射表
  var eighteen = {
    0: '1',
    1: '0',
    2: 'x',
    3: '9',
    4: '8',
    5: '7',
    6: '6',
    7: '5',
    8: '4',
    9: '3',
    10: '2',
  }[remainder]
  // console.log('身份证第18位:'+eighteen)
  if (strID.charAt(17) === eighteen) {
    return true
  }
  return false
}
/**
 * mixins for picture thumbnail
 * 
 * @param {String} src 
 * @param {String} width 
 * @returns {String} src
 */
function thumbnail(src, width) {
  let thumb = {
    '880': '880x0',
    '750': '750x0',
    '570': '570x0',
    '375': '375x0',
    '250': '250x0',
  }
  let thumbList = Object.keys(thumb).reverse()
  // console.log(thumbList)
  if (/_\d+x\d+.\w+$/.test(src)) {
    let ext = src.match(/_\d+x\d+.\w+$/)[0]
    // console.log(ext)
    let oriWidth = ext.match(/_\d+x/)[0]
    oriWidth = parseInt(oriWidth.replace(/[^0-9]/g, ''))
    // console.log(oriWidth)
    if (parseInt(width) <= oriWidth && thumb[width]) {
      return src.replace(/(_\d+x\d+)(.\w+)$/, function (match, p1, p2, offset, string) {
        return `_${thumb[width]}` + p2
      })
    }
    for (let i = 0; i < thumbList.length; i++) {
      if (parseInt(width) <= oriWidth && parseInt(width) >= parseInt(thumb[thumbList[i]])) {
        src = src.replace(/(_\d+x\d+)(.\w+)$/, function (match, p1, p2, offset, string) {
          return `_${thumb[thumbList[i]]}` + p2
        })
        break;
      }
    }
  } else {
    for (let i = 0; i < thumbList.length; i++) {
      if (parseInt(width) >= parseInt(thumb[thumbList[i]])) {
        src = src.replace(/(\w+)(.\w+)$/, function (match, p1, p2, offset, string) {
          return p1 + `_${thumb[thumbList[i]]}` + p2
        })
        break;
      }
    }
  }
  return src
}

/**
 *
 * @export
 * @returns 随机数ID
 */
function randomNumberId() {
  const timestamp = +new Date() // 13位
  return parseInt(Math.random() * (9 << 16) + timestamp)
}
/**
 *
 * @export
 * @returns 随机字符串ID
 */
function randomStringId() {
  const timestamp = +new Date() + ''
  const randomNum = ~~((1 + Math.random()) * (1 << 16)) + ''
  return (+(randomNum + timestamp)).toString(32)
}
/**
 * R,G,B可取值在0~255,当前设定在128~255
 * @export
 * @returns 随机颜色
 */
function randomColor() {
  const R = Math.random() * 127 + 128
  const G = Math.random() * 127 + 128
  const B = Math.random() * 127 + 128
  return '#' + (R << 16 | G << 8 | B).toString(16)
}

module.exports = {
  timeToLastestCn,
  timeToQuantum,
  numberToChinese,
  chineseToNumber,
  textToHtml,
  escapeHtml,
  enUnicode,
  deUnicode,
  isChinaID,
  thumbnail
}