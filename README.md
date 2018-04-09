# niepan

[![Gitter](https://img.shields.io/badge/javascript-1.0.x-%23DD4444.svg)](https://www.github.com/yegao/niepan)
[![Gitter](https://img.shields.io/badge/dependencies-none-%23DD4444.svg)](https://www.github.com/yegao/niepan)
```javascript
var np = niepan();
```
**event**
```javascript
np.sub('xyz',function(){
  console.log('xyz is happend');
})
np.pub('xyz');
```
**http request**
```javascript
np.request({
  url:'https://server/xxx',
  success:function(res){
    console.log(res);
  }
});
```
