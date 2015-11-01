
require("./fa-core").init();

var http =  require("http");

var server = http.createServer(dispatch);

server.on("uncaughtException",function(err){
  process.send("err");
})

var vhosts = {
  "default": new VHost("default")
}
loadProject("./www");

process.on("message",function(m,http){
  http.on("connection",function(socket){
    server.emit("connection",socket);
  })
});

function VHost (domain,handler){
  this.handler = handler || function(req,res){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("Hello World :" + domain );
    res.end();
  }
  this.server = http.createServer(this.handler);
}


function dispatch(req,res){
  var hostname = req.headers.host;
  var vhost = vhosts[hostname] || vhosts['default'];
  vhost.server.emit("request",req,res);
}


function loadProject(path){
  var app = require(path);
  var domain = app.options.vhost.domain;
  vhosts[domain] = new VHost(domain,app.app);
}