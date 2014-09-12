var UTIL = (function(){
	var that = {};
	var working_set_cache = null;

	that.CFG = {
		api_endpoint: "http://localhost/socrates/back-end/listener.php/",
		debug : true
	};

	that.getWorkingSet = function(refID, callback){
		//check if cached
		if(working_set_cache != null){
			callback.call(window, working_set_cache);
		}
		else{
			console.log("Fetching working set for " + refID);
			//download fresh data
			$.ajax({
				url: CFG.api_endpoint + "fetch/" + refID,
				dataType: "json",
				type: "get",
				data: {'returnAllData': true, 'working_set_id': refID},
				success : function(data, stat, jqXHR){
					working_set_cache = data;
					callback.call(window, data);
				},
			});
		}
	}
	return that;
}());
