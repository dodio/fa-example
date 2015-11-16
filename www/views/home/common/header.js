/**
 * 模块  header
 * 依赖  jquery
 * @return {[type]}             [description]
 */
define(function(require, exports, module){
	"use strict";
 	var $ = require("jquery");
 	exports.render = function(lala){
 		$("body").prepend(lala);
 	}
});