var UTIL = (function(){
	var that = {};
	var working_set_cache = null,
		working_set_id = null;

	that.CFG = {
		//api_endpoint: "http://peopleanalytics.org/socrates/transition/back-end/listener.php",
		api_endpoint: "http://localhost/socrates/back-end/listener.php/",
		debug : true
	};

	that.setCachedWorkingSet = function(ws){
		working_set_id = ws["working_set_id"];
		working_set_cache = ws;
	}
	that.getCachedWorkingSetID = function(){
		return working_set_id;
	}
	that.getWorkingSet = function(refID, callback){
		//check if cached
		if(working_set_cache != null && working_set_id == refID){
			callback.call(window, working_set_cache);
		}
		else{
			console.log("Fetching working set for " + refID);
			//download fresh data
			$.ajax({
				url: that.CFG.api_endpoint,
				dataType: "json",
				type: "POST",
				data: {
					'fetch' : true,
					'returnAllData': true, 
					'working_set_id': refID
				},
				success : function(data, stat, jqXHR){
					working_set_cache = data;
					callback.call(window, data);
				},
			});
		}
	}
	return that;
}());
