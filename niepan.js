(function(global,undefined){
  //防止重复加载niepan.js
  if(global.niepan && global.niepan.copyright==='@yegao'){
    return;
  }
  //达到np()等价于new np()的目的
  var np = function(){
    return np.prototype.create(np.prototype);
  }
  np.prototype = {
    //内部静态变量,最好不要动
    version:'1.0.0',
    copyright:'@yegao',
    create:function(parent,init){
      if(typeof init != 'function'){
        init = function(){};
      }
      init.prototype = parent;
      return new init;
    },
    listeners:[],
    sub:function(event,callback,once){
      if(typeof callback === 'function'){
        this.listeners[event]={
            callback : callback,
            once:once
        }
        console.log(this);
      }
    },
    pub:function(event){
      if(this.listeners[event]){
        this.listeners[event].callback();
        if(this.listeners[event].once){
          delete this.listeners[event];
        }
      }else{
        console.warn('not found event \''+event+'\',maybe it has been removed');
      }
    }
  }
  //global
  if(global){
    global.niepan = np;
  }
  //amd
  if(typeof define === 'function' && define.amd){
    define('niepan',[],function(){
      return np;
    })
  }
  //CommonJS
  if(typeof module === 'object' && typeof module.exports === 'object'){
    module.exports = np
  }
})(window || this);
