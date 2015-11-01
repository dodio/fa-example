var fs = require("fs");
fis.set("project.ignore",[ 'node_modules/**', 'app/**','output/**', "*" ,"conf/!(mapJson.js)/**" ,"log/**","plugin/**","static/**","views/**/*.tpl","/views/favicon.ico"])
var prod = fis.media("prod");

var outputDir = "./output";
var projectInfo = require("./project");


// 发布到 output文件夹中,并加上md5戳
var local_dilvery = [fis.plugin('local-deliver', {
      to: outputDir
  	})];

fis.match("*",{
	deploy: local_dilvery,
  	useHash:true
});


// 将mapjson 信息输出到mapJson.build.js中 供插件使用
fis.match("conf/mapJson.js",{
	deploy: fis.plugin('local-deliver', {
      to : "./conf/"
  	}),
  	release : "mapJson.build.js",
  	useHash : false
})



// 默认发布到static（供本地访问）
fis.match("/views/(**)",{
  release : "/static/$1"
})
// 编译less
fis.match("/views/**.less",{
  parser: fis.plugin('less',{
    paths:[ [__dirname,"views"].join(",") ]
  }),
  rExt:"css"
});

// inc/lib 内的 less 不编译, 不发布
fis.match("/views/styles/{inc,lib}/**.{less,css}",{
  parser : null,
  release : false
})

// 将编译信息写入前端config.js
fis.match("/views/js/config.js",{
	deploy : replacer([
        {
            from: '__STATIC_ROOT__',
            to: ""
        },{
        	from: '__STATIC_DIR__',
        	to:"/static/"
        }
    ]).concat(local_dilvery)
})

prod.match("/views/js/config.js",{
	deploy : replacer([
        {
            from: '__STATIC_DIR__',
            to: projectInfo.staticDomain
        },
        {
            from: '__STATIC_ROOT__',
            to: projectInfo.staticDir
        }
    ]).concat(local_dilvery)
})


// 产品发布到 domain + 目录下
prod.match("/views/(**)",{
	domain : projectInfo.staticDomain,
	release : projectInfo.staticDir + "$1"
})

// 产品模式压缩css
prod.match("/views/**.{less,css}",{
	optimizer:fis.plugin('clean-css')
})
// 产品模式压缩js
prod.match("/views/**.js",{
	optimizer:fis.plugin("uglify-js")
})
// 产品打包
prod.match("::package",{
	postpackager: fis.plugin('loader')
});

prod.match("!(styles)/!(lib/**).less",{
	packTo:projectInfo.staticDir + "/pkg/aio.css"
});

console.log("开始清理结果目录:%s",outputDir);
clean(outputDir);
function clean(folder){
	if(!fs.existsSync(folder)){
		return;
	}
	var stat  = fs.statSync(folder);
	if(stat.isFile()){
		fs.unlinkSync(folder);
		return;
	}
	var sub_files = fs.readdirSync(folder);
	if(sub_files.length === 0 ){
		fs.rmdirSync(folder);
		return;
	}
	sub_files.forEach(function(sub){
		clean(folder+"/"+sub);
	});
}



function replacer(opt) {
    if (!Array.isArray(opt)) {
        opt = [opt];
    }
    var r = [];
    opt.forEach(function (raw) {
    	// console.log(raw);
        r.push(fis.plugin('replace', raw));
    });
    return r;
};