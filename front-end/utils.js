//config
var CFG = {
	//host : "http://127.0.0.1:5000",
	//host: "http://128.6.194.150:5000"
	api_endpoint: "http://localhost/socrates/back-end/listener.php/",
	debug : true
};
var fbTimer = null;
var working_set_cache = null;

//useful functions
function getWorkingSet(refID, callback){
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

function showError(message){
	window.clearTimeout(fbTimer);
	fbTimer = window.setTimeout(function(){$("#feedback").fadeOut()}, 10000);
	$("#feedback").fadeIn().html(message).removeClass("suc").addClass("err");
}