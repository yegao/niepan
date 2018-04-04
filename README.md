# niepan
```javascript
var np = niepan();
##event

np.sub('xyz',function(){
  console.log('xyz is happend');
})
np.pub('xyz');

##http request
np.request({
  url:'https://server/xxx',
  success:function(res){
    console.log(res);
  }
});
```
