(function(global,undefined){
  //达到prop()等价于new prop()的目的
  var prop = function(){
    return prop.create(prop.prototype);
  }
  prop.prototype = {
    create:function(parent,init){
      if(typeof init != 'function'){
        init = function(){};
      }
      init.prototype = parent;
      return new init;
    }
  }
})(window,undefined);
