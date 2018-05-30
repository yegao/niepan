/**
 * @todo需不需要将插入的子节点转成niepan,或者是添加一个参数来控制?
 * @param  {[object|string]} elementOrString [description]
 * @param  {[object]} parentNode      [description]
 * @return {[object]}                 [description]
 */
const append = function(elementOrString, parentNode) {
  if (!parentNode || typeof parentNode != 'object') {
    throw new Error('you append a element to a undefined parent node');
  }
  switch (typeof elementOrString) {
    case 'object':
      return parentNode.appendChild(elementOrString);
    case 'string':
      parentNode.innerHTML += elementOrString;
      return '' //ast(elementOrString)
    default:
      throw new Error('you append a element to a undefined parent node');
  }
}

/**
 * [hasOwnProps description]
 * @param  {[type]}  obj   [description]
 * @param  {[type]}  props [description]
 * @return {Boolean}       [description]
 */
const hasOwnProps = (obj,...props) => {
  if(!(obj instanceof Object)){
    throw new Error('the first augument of hasOwnProps must be a instance of Object!');
  }
  for(let prop of props){
    if(!obj.hasOwnProperty(prop)){
      return false;
    }
  }
  return true;
}

/**
 * [attachValue description]
 * @param  {[type]} s [description]
 * @param  {[type]} v [description]
 * @return {[type]}   [description]
 */
const attachValue = (s,v) => {
  let list = [];
  if(typeof s === 'string'){
    list = s.split(',');
  }
  return list.reduce(function(prev, curr) {
    prev[curr] = v ;
    return prev;
  }, {});
}

export default {
  append,
  hasOwnProps,
  attachValue
}
