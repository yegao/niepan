# niepan
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
