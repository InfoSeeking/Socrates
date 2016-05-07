var UTIL = (function(){
	var that = {};
	var working_set_cache = null,
		working_set_id = null;

	that.CFG = {
		api_endpoint: "/socrates",
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
	that.clearWorkingSetCache = function(){
		working_set_cache = null;
	}
	that.getWorkingSet = function(refID, callback){
		//check if cached
		if(working_set_cache != null && working_set_id == refID){
			callback.call(window, working_set_cache);
		}
		else {
			// Download fresh data.
			API.sendRequest({
				data: {
					'fetch' : true,
					'returnAllData': true, 
					'working_set_id': refID
				},
				success : function(data){
					working_set_cache = data;
					if(callback){
						callback.call(window, data);
					}
				}
			});
		}
	}

	that.removeWorkingSet = function(working_set_id, callback){
		API.sendRequest({
			data: {
				'remove' : true,
				'working_set_id': working_set_id
			},
			success : function(data){
				working_set_cache = data;
				if(callback){
					callback.call(window, data);
				}
			}
		});
	}

	that.renameWorkingSet = function(working_set_id, new_name, callback){
		API.sendRequest({
			data: {
				'rename' : true,
				'new_name' : new_name,
				'working_set_id': working_set_id
			},
			success : function(data, stat, jqXHR){
				if(callback){
					callback.call(window);
				}
			}
		});
	}

	that.downloadWorkingSet = function(working_set_id) {
		// TODO: update.
		// var win = window.open(that.CFG.api_endpoint + "?force_download=true&fetch=true&username=" + UI.getUsername() + "&password=" + UI.getPassword() + "&working_set_id=" + working_set_id);
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
