var os = require("os");
var child_process = require("child_process");
var cpus = os.cpus();

var childs = [];

// 开发模式单进程就可以了
if(process.env.FA_ENV == "dev"){
	childs.push(child_process.fork("./server"))
}else{
	cpus.forEach(function(c,i) {
	  console.log("第"+i+"个子进程");
	childs.push(child_process.fork("./server"))
	})
}

var server = require("net").createServer();
var port = process.env.FA_PORT || 82;
server.listen(port,function(){
  console.log("server listens on port :%s", port );
  childs.forEach(function(p){
    p.send("server",server);
  })
  server.close();
});
