module.exports = function(router) {
	router.get("/",function(req,res){
		res.cookie("haha","lala",{
			signed:true
		});

		var user = req.session.user;

		if(!user){
			user = req.session.user = {
				uid:23,
				username :"张三"
			};
			console.log("设置user");
		}

		res.data("user",user)
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