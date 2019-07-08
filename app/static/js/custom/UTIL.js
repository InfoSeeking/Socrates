/*
 * Class for general utility functions. Contains configuration
 */
var UTIL = (function(){
	var that = {};


	that.CFG = {
		api_endpoint: "",
		login_endpoint: "",
		ui_endpoint: "",
		debug : false
	};



	that.supports_html5_storage = function(){
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (e) {
        return false;
      }
    }

    $.ajax({
		url:"/config",
		async:false,
		success:function(json) {
			json = JSON.parse(json);
			console.log(json);
			console.log("obtained");
			that.CFG.api_endpoint = json.api_endpoint;
			that.CFG.login_endpoint = json.login_endpoint;
			that.CFG.ui_endpoint = json.ui_endpoint;
			that.CFG.debug = json.debug;
			console.log(that);

		}
	});

	return that;

})();
