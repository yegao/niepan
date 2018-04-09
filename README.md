# niepan

[![Gitter](https://img.shields.io/badge/javascript-1.0.x-%23DD4444.svg)](https://www.github.com/yegao/niepan)
[![Gitter](https://img.shields.io/badge/dependencies-none-%2344FF44.svg)](https://www.github.com/yegao/niepan)
```javascript
var np = niepan();
```
**event**
```javascript
np.sub('xyz',function(){
  console.log('xyz is happend');
})
np.pub('xyz');

var li1 = niepan(document.getElementById('li1'));
console.log(li1);
li1.sub('click',function(){
  console.log('clicked li1,this event could be pubed all the time');
});

var body= niepan(document.body);
console.log(body);
body.sub('click',function(){
  console.log('clicked body,this event would be pubed only one time');
},true);
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
