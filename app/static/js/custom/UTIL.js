/*
 * Class for general utility functions
 */
var UTIL = (function(){
	var that = {};


	that.CFG = {
		api_endpoint: "http://localhost:5000/socrates",
		login_endpoint: "http://localhost:5000/app",
		ui_endpoint: "http://localhost:5000/app",
		debug : true
	};



	that.supports_html5_storage = function(){
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (e) {
        return false;
      }
    }
	return that;
}());
