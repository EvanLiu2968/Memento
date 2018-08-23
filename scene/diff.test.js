const diff = require('./diff')

console.log(diff({
  'a':'3',
  'b':{
    'x1':'1',
    'x2':'2',
    'x3':function(){},
  }
},{
  'a':'3',
  'b':{
    'x1':'1',
    'x2':2,
    'x3':function(){},
  }
}))