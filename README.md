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

It will throw a error when define a niepan for the same element moe than one time;
```javascript
var input = niepan(document.getElementById('input1'));
var input = niepan(document.getElementById('input1'));//ERROR
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
**two-way data-binding**
```html
<input id="input1" type="text" value="" watch="name" placeholder="place input your name" />
```
```javascript
var input1 = niepan(document.getElementById('input1'));
input1.sub('input',function(evt){
  console.log(input1.$data.name);
});
```
