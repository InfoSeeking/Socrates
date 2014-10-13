var UTIL = (function(){
	var that = {};
	var working_set_cache = null,
		working_set_id = null;

	that.CFG = {
		//api_endpoint: "http://peopleanalytics.org/socrates/transition/back-end/listener.php",
		api_endpoint: "http://localhost/socrates/back-end/listener.php/",
		debug : true
	};

	that.setCurrentWorkingSet = function(ws, cache){
		working_set_id = ws["working_set_id"];
		if(cache){
			working_set_cache = ws;
		}
	}
	that.getCurrentWorkingSetID = function(){
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
					if(callback){
						callback.call(window, data);
					}
				},
				error: function(){
					UI.feedback("Error fetching dataset", true);
				}
			});
		}
	}

	that.removeWorkingSet = function(working_set_id, callback){
		UI.toggleLoader(true);
		$.ajax({
			url: that.CFG.api_endpoint,
			dataType: "json",
			type: "POST",
			data: {
				'remove' : true,
				'working_set_id': working_set_id
			},
			success : function(data, stat, jqXHR){
				working_set_cache = data;
				if(callback){
					callback.call(window, data);
				}
				UI.toggleLoader(false);
			},
			error: function(){
				UI.feedback("Error removing dataset", true);
				UI.toggleLoader(false);
			}
		});
	}
	that.supports_html5_storage = function(){
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (e) {
        return false;
      }
    }
	return that;
}());
