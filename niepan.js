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
    sub:function(event,callback){
      if(typeof callback === 'function'){
        this.listeners[event] = callback;
        console.log(this);
      }
    },
    pub:function(event){
      if(this.listeners[event]){
        this.listeners[event]();
      }
    },

  }
  global.niepan = np;
})(window);
