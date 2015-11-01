(function() {

	var rs_map = __RESOURCE_MAP__;
	window.STATIC_ROOT = "__STATIC_ROOT__";
	window.STATIC_DIR = "__STATIC_DIR__";
	if(!rs_map){
		window.STATIC_BASE = "/js";
	}else{
		window.STATIC_BASE = STATIC_ROOT + STATIC_DIR + "js";
	}
	var seamap = [];
	for(var i in rs_map.res){
		if(!/\.(js|css)$/.test(i)){
			continue;
		}
		var rs = rs_map.res[i];
		var realname = i.replace(/^views\/js\//,"");
		if(rs.pkg){
			var mapname = rs_map.pkg[rs.pkg].uri.replace(new RegExp("^" + STATIC_DIR + "js/"),"");
		}else{
			var mapname = rs.uri.replace(new RegExp("^" + STATIC_DIR + "js/"),"");
		}
		seamap.push([realname,mapname]);
	}

	R.init({
		base: STATIC_BASE,
		alias:{
			"jquery":"lib/jquery/jquery-1.10.1"
		},
		map : seamap
	});
})()