(function(global, undefined) {

  //防止重复加载niepan.js
  if (global.niepan && global.niepan.copyright === '@yegao') {
    return;
  }

  //达到np()等价于new np()的目的
  var np = function(element = null) {
    return np.prototype.create(np.prototype, element);
  }

  //原型属性
  np.prototype = {
    //内部静态变量,最好不要动
    version: '1.0.7',
    copyright: '@yegao',
    /**
     * @todo 抽象语法树
     * @param  {[type]} element [description]
     * @param  {[type]} _index  [description]
     * @param  {[type]} _res    [description]
     * @return {[type]}         [description]
     */
    ast:function(element,_index,_res){
      // if(Object.prototype.toString.call(element) === "[object Array]"){
      //   console.warn('the ast get multiple trees');
      //   return ;
      // }
      if(!element){
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
      if(element.childElementCount){
        var children = element.childNodes;
        for(var index of children){
          var child = children[index];
          child.index = element.index+'|'+index;
          return this.ast(child,res);
        }
      }
      res.push({
        nodeName:element.nodeName,
        childNodes:element.childNodes,
        parent:parentIndex || 0,
        nodeType:element.nodeType
      });
      return res;
    },
    /**
     * @todo需不需要将插入的子节点转成niepan,或者是添加一个参数来控制?
     * @param  {[object|string]} elementOrString [description]
     * @param  {[object]} parentNode      [description]
     * @return {[object]}                 [description]
     */
    append: function(elementOrString, parentNode) {
      if (!parentNode || typeof parentNode != 'object') {
        throw new Error('you append a element to a undefined parent node');
      }
      switch (typeof elementOrString) {
        case 'object':
          return parentNode.appendChild(elementOrString);
        case 'string':
          parentNode.innerHTML += elementOrString;
          return ast(elementOrString)
        default:
          throw new Error('you append a element to a undefined parent node');
      }
    },
    /**
     * 以prototype为原型创建一个对象，该对象的element属性为element
     * @todo 是否需要合并重复的niepan,脏检查或者直接将元素上的事件就直接放到元素上，仔细一想也没什么必要...待定
     * @param  {object} prototype 原型
     * @param  {object} element   niepan对绑定的元素
     * @return {object}           生成的niepan
     */
    create: function(prototype, element) {
      // 实例属性
      var init = function() {
        //传参里的element的优先级最高，如果没有传element就检查有没有定义template函数
        this.element = element || null;
        //元素原本就有的事件监听类型
        this.originals = [];
        //listeners = originals + unoriginals
        this.listeners = [];
        //watch 实现双向绑定
        var watch = element.getAttribute('watch');
        if(watch){
          if(typeof watch != 'string'){
            throw new Error('the attribute "watch" should be a string!');
          }
          var tag = element.tagName.toLocaleLowerCase();
          if(tag == 'input' || tag == 'textarea'){

          }
        }
        //状态
        this.status = {};
        this.set = function(k,v){
          this.status[k] = v;
          return this.status;
        };
        this.get = function(k){
          return this.status[k];
        }
      };
      // 原型属性
      init.prototype = prototype;
      return new init;
    },
   /**
    * 通过sub注册的事件如果是元素自带的系统事件，既可以通过pub触发也可以通过系统方式(比如点击鼠标)触发
    * 通过sub注册的事件如果是自定义的事件，只能通过pub触发
    * @param  {[type]}   event    事件名
    * @param  {Function} callback 事件被触发后执行的回调方法
    * @param  {[type]}   once     该事件被触发一次之后是否被销毁
    */
    sub: function(event, callback, once) {
      console.log(this.element, event);
      if (typeof callback === 'function') {
        //自定义事件
        this.listeners[event] = {
          callback: callback, //事件回调方法
          once: once, //是否只能被触发一次
          system: this.element && ('on' + event in this.element) && Symbol(event) //是否是元素自带的系统事件,是则返回一个Symbol
        }
        //系统事件
        var systemSymbol = this.listeners[event].system;
        if (systemSymbol) {
          var systemCallback = this.originals[systemSymbol] = (function(evt) {
            if(event=='input' && this.watch){
              //@TODO: 
              //直接将watch绑定到niepan的原型属性上
              //这样有好处也有坏处
              //好处是轻松地解决了跨组件之间变量不能互相通用的问题
              //坏处是没有隔离不同组件之间不同变量的通讯
              this.data[watch] = evt.target.value;
            }
            console.log(this, evt);
            if (this.listeners[event].once) {
              delete this.originals[systemSymbol];
              this.element.removeEventListener(event, systemCallback);
            }
            this.pub(event);
          }).bind(this);
          this.element.addEventListener(event, systemCallback);
        }
      }
    },
    /**
     * 触发事件
     * @param  {string} event 事件名
     */
    pub: function(event) {
      if (this.listeners[event]) {
        this.listeners[event].callback();
        if (this.listeners[event].once) {
          console.log('delete');
          delete this.listeners[event];
        }
      } else {
        console.warn('not found event \'' + event + '\',maybe it has been removed');
      }
    },
    /**
     * 绑定事件,该事件只能被触发一次就会被销毁
     * @param  {object}   event    [description]
     * @param  {Function} callback [description]
     */
    once: function(event, callback) {
      this.sub(event, callback, true);
    },
    /**
     * 发送http请求
     * @param  {object} o [description]
     */
    request: function(o) {
      if (!o.url) {
        throw new Error('niepan.request need url!');
      }
      var url = o.url,
        method = o.method || 'GET',
        success = o.success || function() {},
        fail = o.fail || function() {};
      var xhr = null;
      if (global.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) { // for IE5 and IE6
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
      if (xhr) {
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) { // XMLHttpRequest.DONE
            if (xhr.status == 200) { // 200 = "服务端成功处理"
              success(xhr.response);
            } else {
              throw new Error("");
            }
          }
        };
        xhr.open(method, url, true);
        if (o.headers && Object.prototype.toString.call(o.headers) === "[object Array]") {
          // headers = o.headers || [{
          //   'Content-Type': 'application/x-www-form-urlencoded'
          // }];
          headers.forEach(function(v, k) {
            xhr.setRequestHeader(k, v);
          });
        }
        xhr.send(null);
      } else {
        throw new Error("current environment does not support XMLHTTP!");
      }
    },
    /**
     * 动画
     * @param  {Function} fn   [description]
     * @param  {number}   time [description]
     */
    animate:function(fn,time){
      function step(){
        if(typeof fn === 'function'){
          fn();
        }
        if(global.requestAnimationFrame){
          global.requestAnimationFrameraf(step);
        }
        else{
          setTimeout(step,time)
        }
      }
    },
    // 双向绑定
    // mvvm:{
    //     target:$niepan$
    // },
    // 文件上传
    // file:function(resource,callback){
    //   if(callback){
    //     callback();
    //   }
    //   return {
    //     progress:0,
    //     url:''
    //   }
    // },

    /**
     * MutationObserver 的不同兼容性写法
     * 该构造函数用来实例化一个新的 Mutation 观察者对象
     * Mutation 观察者对象能监听在某个范围内的 DOM 树变化
     * @type {[type]}
     */
    obeserve:function(){
      var MutationObserver = global.MutationObserver || global.WebKitMutationObserver || global.MozMutationObserver;
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(v) {
          var nodes = v.addedNodes;
          for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (this.notxss.blacks.indexOf(node.src) != -1){
              try {
                node.parentNode.removeChild(node);
                console.log('拦截可疑静态脚本:', node.src);
              } catch (e) {
                console.warn(e);
              }
            }
          }
        });
      });
      // 传入目标节点和观察选项
      // 如果 target 为 document 或者 document.documentElement
      // 则当前文档中所有的节点添加与删除操作都会被观察到
      observer.observe(document, {
        subtree: true,
        childList: true
      });
    },
    /**
     * 防止xss攻击
     * @type {Object}
     */
    notxss:{
      keywords:[],//检测的关键字符
      withelist:[],//白名单列表
      blacks:[],//黑名单列表
    }
  }


  //global、amd、cmd、Commonjs
  if (global) {
    global.niepan = np;
  } else if (typeof define === 'function') {
    if (define.amd) {
      define('niepan', [], function() {
        return np;
      })
    } else if (define.cmd) {
      define(function(require, exports, module) {
        module.exports = np;
      })
    }
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = np
  } else {
    throw new Error('current environment do not support niepan');
  }


})(window || this);
