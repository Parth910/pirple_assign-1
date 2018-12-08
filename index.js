// add dependencies
var http=require('http');
var https=require('https');
var StringDecoder=require('string_decoder').StringDecoder;
var fs=require('fs');
var url=require('url');
var config = require('./config');
// server respond
var httpserver=http.createServer(function (req,res) {
  unifiedServer(req,res);
});


httpserver.listen(config.httpPort,function () {
  console.log('sevar is listening on '+config.httpPort+'in'+config.envName);
});

var httpsServerOption={
  'key':fs.readFileSync('./https/key.pem'),
  'cert':fs.readFileSync('./https/cert.pem')
}

var httpsServer=https.createServer(httpsServerOption,function (req,res) {
  unifiedServer(req,res);
});


httpsServer.listen(config.httpsPort,function () {
  console.log('sevar is listening on '+config.httpsPort+'in'+config.envName);
});

var unifiedServer =function(req,res){
// get url and parse it
var parsedUrl=url.parse(req.url,true);
// get the path
var path=parsedUrl.path;
var trimmedurl=path.replace(/^\/+|\/+$/g,'');
// http method identifier
var method=req.method.toLowerCase();
// get query string as an object
var querystringobj=parsedUrl.query;
// header as an object
var headers=req.headers;
//get the payload and decode it
var decoder=new StringDecoder('utf-8');
var buffer='';
req.on('data',function (data) {
buffer += decoder.write(data);
});
req.on('end',function () {
buffer +=decoder.end();

var chosenhandeler=typeof(router[trimmedurl]) !== 'undefined' ?  router[trimmedurl]:handlers.notfound;
var data = {
  'trimmedurl':trimmedurl,
  'queryStringObject' :querystringobj,
  'method':method,
  'headers' :headers,
  'payload' :buffer

};
chosenhandeler(data,function(statuscode,payload){
   statuscode= typeof(statuscode) == 'number' ? statuscode :200;
   payload=typeof(payload) == 'object' ? payload: {'name':'hello'};
   var payloadString = JSON.stringify(payload);
   res.setHeader('content-type' , 'application/json');
   res.writeHead(statuscode);
   res.end(payloadString);
   console.log("returning these response: ", statuscode,payloadString); 
   
});

  //send the respond
//  res.end("hello\n");

//log the request path


});


}

var handlers={};
handlers.hello=function(data,callback){
  callback(200,{'name':'welcome to my first resfulAPI'});
};
handlers.notfound=function(data,callback){
  callback(404);
};

var router={
  'hello': handlers.hello
}
