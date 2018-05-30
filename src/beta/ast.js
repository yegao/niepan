/**
 * @todo 抽象语法树
 * @param  {[type]} element [description]
 * @param  {[type]} _index  [description]
 * @param  {[type]} _res    [description]
 * @return {[type]}         [description]
 */
const ast = function(element, _index, _res) {
  // if(Object.prototype.toString.call(element) === "[object Array]"){
  //   console.warn('the ast get multiple trees');
  //   return ;
  // }
  if (!element) {
    return;
  }
  /********************************************************************************************
   *     ·[3]                                                                                 *
   *     ·[2]            ·[2]                            ·[4]                                 *
   *     ·[3]            ·[3]            ·[3]            ·[2]        ·[2]        ·[0]    ·[1] *
   *     ·[0]·[0]·[0]    ·[0]·[0]·[0]    ·[0]·[0]·[0]    ·[0]·[0]    ·[0]·[0]            ·[0] *
   ********************************************************************************************/
  var index = _index || 0;
  var res = _res || [];
  //nodeType 1的比如img的childElementCount为0 nodeType为3的txt没有childElementCount
  if (element.childElementCount) {
    var children = element.childNodes;
    for (var index of children) {
      var child = children[index];
      child.index = element.index + '|' + index;
      return this.ast(child, res);
    }
  }
  res.push({
    nodeName: element.nodeName,
    childNodes: element.childNodes,
    parent: parentIndex || 0,
    nodeType: element.nodeType
  });
  return res;
}
