const http = require('http');
const server = http.createServer((req,res)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log(res);
  var result = JSON.stringify({name:'yegao','age':28})
  res.end(result);
  // res.end({'name':'yegao','age':28});
});
server.listen(8888);
