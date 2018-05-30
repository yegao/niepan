// 1.发现不能重写element.__proto__.value的setter方法（native code）
// console.log(Object.getOwnPropertyDescriptor(this.$element.constructor.prototype,'value').set);
// Object.getOwnPropertyDescriptor(this.$element.constructor.prototype,'value').set = function(){
//   console.log('xxx');
// }
