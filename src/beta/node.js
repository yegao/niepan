//其他构造函数
var NpNode = function(tag, data, children, text) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
}
module.exports = {
  createEle: function(npNode) {
    var tag = npNode.tag;
    var data = npNode.data;
    var children = npNode.children;
    var text = npNode.text;
    if (tag !== undefined) {
      npNode.elm = document.createElement(tag);
      if (data.attrs !== undefined) {
        var attrs = data.attrs;
        for (var key in attrs) {
          npNode.elm.setAttribute(key, attrs[key])
        }
      }
      if (children) {
        this.createChildren(npNode, children)
      }
    } else {
      npNode.elm = document.createTextNode(text);
    }
    return npNode.elm;
  },
  createChildren: function(NpNode, children) {
    for (var i = 0; i < children.length; ++i) {
      NpNode.elm.appendChild(this.createElm(children[i]));
    }
  },
  patch: function(oldNpNode, NpNode) {
    this.createElm(NpNode)
    var isRealElement = oldNpNode.nodeType !== undefined; // 虚拟节点没有nodeType属性
    if (isRealElement) {
      var parent = oldNpNode.parentNode;
      if (parent) {
        parent.insertBefore(NpNode.elm, oldNpNode);
        parent.removeChild(oldNpNode);
      }
    }
    return NpNode.elm
  },
  transform: function(component){
    var reg = new RegExp('');
    var res = {

    };
    return {
      div:'div',
      attr:{
        attrs: {
          'class': 'wrapper'
        }
      },
      children:[
        new NpNode(
          'p',
          {
            attrs: {
              'class': 'inner'
            }
          },
          [
            new NpNode(undefined, undefined, undefined, 'Hello world')
          ]
        )
      ],
      text:''
    }
  },
  render: function(component) {
    var NpNode = this.NpNode;
    var params = this.transform(component)
    return new NpNode(params);
  },
  mount: function(el) {
    var NpNode = this.render();
    this.patch(el, NpNode)
  },
}
