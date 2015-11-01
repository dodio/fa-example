module.exports = function(router) {
	router.get("/",function(req,res){
		res.cookie("haha","lala",{
			signed:true
		});
		res.render("home/index",{
	      hello : "greetings",
	      username:"张三"
	    });
	});
}