module.exports = function(router) {
	router.get("/",function(req,res){
		res.cookie("haha","lala",{
			signed:true
		});
		res.data("user",{
			uid:23,
			username :"张三"
		})
		res.data('username',"李四");

		res.render("home/index", res.data.get() );
	});
	router.get("/data",function(req,res){
		res.redirect("/data1");
	})
	router.get("/data1",function(req,res){
		res.render("home/about");
	})
}