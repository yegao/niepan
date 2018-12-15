import utils from  './utils.js'

(function(global, undefined) {

  //防止重复加载niepan.js
  if (global.niepan && global.niepan.copyright === '@yegao') {
    return;
  }

  var niepanTree = {};
  var nextListeners = [];
  var store = {
    state: {},
    reducers: {},
    subscribe(listener) {
      nextListeners.push(listener)
      return function unsubscribe() {
        const index = nextListeners.indexOf(listener)
        nextListeners.splice(index, 1)
      }
    },
    dispatch(key,action){
      currentReducer = this.reducers[key]
      currentState = currentReducer(currentState, action); //这里调用reducer(state, action)。
      const listeners = currentListeners = nextListeners
      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i]
        listener(); //这里调用store.subscribe注册进来的监听器
      }
      return action
    }
    // ,
    // extend({data=null,watch=null,method=null}){
    //   if(Object.prototype.toString.call(data) === '[object Object]'){
    //     //es6 (for const key in data)
    //     for(var dataKey in data){
    //       store.data[dataKey] = data[dataKey];
    //     }
    //   }
    //   if(Object.prototype.toString.call(watch) === '[object Object]'){
    //     var watchKeys = Object.keys(watch);
    //     var watchDescriptionMap = watchKeys.reduce(function(previous,current){
    //       previous[current] = {
    //         enumerable: true,
    //         configurable: true,
    //         set: function(value) {
    //           watch[current] = value;
    //           // 遍历所有的niepan,并将有用到该watchkey的组件全部重新渲染，包括该组件的所有子组件，当然如果该子组件一定没有用到该watchKey可以不用重新渲染
    //         },
    //         get: function() {
    //           return watch[current];
    //         }
    //       }
    //       return previous;
    //     },{});
    //     Object.defineProperties(store.watch,watchDescriptionMap);
    //   }
    //   if(Object.prototype.toString.call(method) === '[object Object]'){
    //     for(var methodKey in method){
    //       if(typeof method[methodKey] === 'function'){
    //         store.method[methodKey] = method[methodKey];
    //       }
    //     }
    //   }
    // }
  }

  // np() <=> new np()
  var np = function(element = null) {
    return np.prototype.create(np.prototype, element);
  }

  // 实例自有属性
  np.prototype = {
    //内部静态变量,最好不要动
    version: '1.0.8',
    copyright: '@yegao',
    /**
     * 以prototype为原型创建一个对象，该对象的element属性为element
     * @todo 是否需要合并重复的niepan,脏检查或者直接将元素上的事件就直接放到元素上，仔细一想也没什么必要...待定
     * @param  {object} prototype 原型
     * @param  {object} element   niepan对绑定的元素
     * @return {object}           生成的niepan
     */
    create: function(prototype, element) {
      if (element) {
        if (element.$np) {
          throw new Error('this element has been a niepan');
        }
        //每个被niepan加工过的element都有一个$np属性，且值为true
        element.$np = true;
      }
      // 实例属性都有一个$符号,原型属性没有$符号
      var init = function() {
        const that = this;
        //将全局store挂载到原型上
        that.$store = store;
        //传参里的element的优先级最高，如果没有传element就检查有没有定义template函数
        that.$element = element;
        //当前实例绑定的变量全部放在$data中
        that.$data = {};
        //元素原本就有的事件监听类型
        that.$originals = [];
        //listeners = originals + unoriginals
        that.$listeners = [];
        //实现that.$data[$that.$watch]的双向绑定
        that.$watch = element && element.getAttribute('watch');
        if (that.$watch) {
          if (typeof that.$watch != 'string') {
            throw new Error('the attribute "watch" should be a string!');
          }
          Object.defineProperties(that.$data, utils.attachValue(that.$watch,{
            enumerable: true,
            configurable: true,
            set: function(v) {
              that.$element.value = v;
            },
            get: function() {
              return that.$element.value;
            }
          }))
        }
        //状态
        that.$set = function(k, v) {
          that.$data[k] = v;
          return that.$data;
        };
        that.$get = function(k) {
          return that.$data[k];
        }
      };
      // 原型属性
      init.prototype = prototype;
      var niepan = new init;
      niepanTree[Symbol()] = niepan;
      return niepan;
    },
    /**
    * 通过sub注册的事件如果是元素自带的系统事件，既可以通过pub触发也可以通过系统方式(比如点击鼠标)触发
    * 通过sub注册的事件如果是自定义的事件，只能通过pub触发
    * @param  {[type]}   event    事件名
    * @param  {Function} callback 事件被触发后执行的回调方法
    * @param  {[type]}   once     该事件被触发一次之后是否被销毁
    */
    sub: function(event, callback, once) {
      // console.log(this.$element, event);
      if (typeof callback === 'function') {
        //自定义事件
        this.$listeners[event] = {
          callback: callback, //事件回调方法
          once: once, //是否只能被触发一次
          system: this.$element && ('on' + event in this.$element) && Symbol(event) //是否是元素自带的系统事件,是则返回一个Symbol
        }
        //系统事件
        var systemSymbol = this.$listeners[event].system;
        if (systemSymbol) {
          var systemCallback = this.$originals[systemSymbol] = (function(evt) {
            // console.log(this, evt);
            if (this.$listeners[event].once) {
              delete this.$originals[systemSymbol];
              this.$element.removeEventListener(event, systemCallback);
            }
            this.pub(event);
          }).bind(this);
          this.$element.addEventListener(event, systemCallback);
        }
      }
    },
    /**
     * 触发事件
     * @param  {string} event 事件名
     */
    pub: function(event) {
      if (this.$listeners[event]) {
        this.$listeners[event].callback();
        if (this.$listeners[event].once) {
          console.log('delete');
          delete this.$listeners[event];
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
     * 暴露store给外部调用
     */
    get store(){
      return store;
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
    animate: function(fn, time) {
      function step() {
        if (typeof fn === 'function') {
          fn();
        }
        if (global.requestAnimationFrame) {
          global.requestAnimationFrameraf(step);
        } else {
          setTimeout(step, time)
        }
      }
    },
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
    obeserve: function() {
      var MutationObserver = global.MutationObserver || global.WebKitMutationObserver || global.MozMutationObserver;
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(v) {
          var nodes = v.addedNodes;
          for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (this.notxss.blacks.indexOf(node.src) != -1) {
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
    notxss: {
      keywords: [], //检测的关键字符
      withelist: [], //白名单列表
      blacks: [], //黑名单列表
    }
  }

  // Commonjs
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = np
  } else {
    throw new Error('current environment do not support niepan');
  }
  //global、amd、cmd、
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
  }
})(window || this);
