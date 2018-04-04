(function(global, undefined) {
  //防止重复加载niepan.js
  if (global.niepan && global.niepan.copyright === '@yegao') {
    return;
  }

  //达到np()等价于new np()的目的
  let np = function() {
    return np.prototype.create(np.prototype);
  }

  np.prototype = {
    //内部静态变量,最好不要动
    version: '1.0.0',
    copyright: '@yegao',
    create: function(parent, init) {
      if (typeof init != 'function') {
        init = function() {};
      }
      init.prototype = parent;
      return new init;
    },
    //event
    listeners: [],
    sub: function(event, callback, once) {
      if (typeof callback === 'function') {
        this.listeners[event] = {
          callback: callback,
          once: once
        }
        console.log(this);
      }
    },
    pub: function(event) {
      if (this.listeners[event]) {
        this.listeners[event].callback();
        if (this.listeners[event].once) {
          delete this.listeners[event];
        }
      } else {
        console.warn('not found event \'' + event + '\',maybe it has been removed');
      }
    },
    //http
    request: function(o) {
      if (!o.url) {
        throw new Error('niepan.request need url!');
      }
      let url = o.url,
        method = o.method || 'GET',
        success = o.success || function() {},
        fail = o.fail || function() {};
      let xhr = null;
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
        headers = o.headers || {'Content-Type':'application/x-www-form-urlencoded'};
        headers.forEach(function(v,k){
          xhr.setRequestHeader(k, v);
        });
        xhr.send(null);
      } else {
        throw new Error("current environment does not support XMLHTTP!");
      }
    }
  }

  //global、amd、cmd、Commonjs
  if (global) {
    global.niepan = np;
  }
  else if (typeof define === 'function') {
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
  else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = np
  }
  else{
    throw new Error('current environment do not support niepan');
  }
})(window || this);
