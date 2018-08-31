/**
 * Time:  O(n)
 * Space: O(1)
 *
 * Given a array, return their tree relations by parentId.
 *
 * For example,
  const arr = [
    {
      id: '1'
    },
    {
      id: '2', parentId: '1'
    }
  ]
  Return [{
    {
      id: '1',
      children: [
        {
          id: '2', parentId: '1'
        }
      ]
    }
  }]
 */
'use strict';

/**
 * List transform to Array tree.
 * @param  {Array} list
 * @return {Array} tree
 */
exports.listToTree = function listToArrayTree(list, parentId){
  if(!list.length) return [];

  const itemArr = [];
  for(let i=0;i<list.length;i++){
    let node=Object.assign({}, list[i]);
    if(node.parentId == parentId ){
      node.children = listToArrayTree(list,node.id)
      itemArr.push(node);
    }
  }
  if(itemArr.length){
    return itemArr
  }
}

/**
 * List transform to a completely different form before.
 * @param  {Array} list
 * @return {Array} list
 */
exports.listToDisorder = function listToDisorder(list = [], depth = 1){
  let cloneList = list.slice(0)
  let temp = [];
  const getRandomNum = (min,max) => {
    return parseInt(Math.random()*(max-min))
  }
  // console.log('depth: '+depth)
  cloneList.forEach((item,i) => {
    let num =0;
    const combNum = () => {
      num = getRandomNum(0,cloneList.length)
      
      if(cloneList[num] === cloneList[i]){ // completely different
        combNum()
      }
    }
    combNum()
    temp = temp.concat(cloneList.splice(num,num+1))
  })
  depth--;
  if(depth>0){
    listToDisorder(temp, depth)
  }
  return temp
}