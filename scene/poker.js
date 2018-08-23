

function getOriginPokers(){
  const pokerCards = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'],
  pokerColors = ['Spade','Heart','Diamond','Club'];

  const pokers = [];
  pokerCards.forEach((card)=>{
    pokerColors.forEach((color)=>{
      pokers.push(`${card}-${color}`)
    })
  })
  return pokers
}


function getRandomNum(min,max){
  return parseInt(Math.random()*(max-min))
}


function shuffle(pokers = [],depth = 1){
  const tombPokers = pokers.concat([]);
  let combPokers = [];
  // console.log('shuffle: '+depth)
  pokers.forEach((item,i)=>{
    let num =0;
    const combNum = ()=>{
      num = getRandomNum(0,tombPokers.length)
      if(tombPokers[num] === pokers[i]){
        combNum()
      }
    }
    combNum()
    combPokers = combPokers.concat(tombPokers.slice(num,num+1))
  })
  depth--;
  if(depth>0){
    shuffle(combPokers,depth)
  }
  return combPokers
}

module.exports = {
  getOriginPokers,
  shuffle,
}