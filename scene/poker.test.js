const poker = require('./poker')

const originPockers = poker.getOriginPokers()
console.log(poker.shuffle(originPockers, 2))