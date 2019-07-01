/*
 *
 * Screen for handling data-related things
 *
 */

var DataScreen = (function(){
    var that = {};
    var working_set_cache = null,
		working_set_id = null;
    
    that.show = function(){
      $(".screen.data").show();
      $.ajax({
        url: UTIL.CFG.api_endpoint,
        type : "POST",
        dataType: "json",
        contentType:"application/json",
        data : JSON.stringify({
          "username" : UI.getUsername(),
          "password" : UI.getPassword(),
          "fetch_all_ids" : true
        }),
        success: function(data, jqxhr){
          clearList();
          for(var i = 0; i < data.ids.length; i++){
            addWorkingSet(data.ids[i]["id"], data.ids[i]["name"], data.ids[i]["function"]);
          }
        }
      })
    };

    that.hide = function(){
      $(".screen.data").hide();
    };

    
    function clearList(){
      $(".screen.data #data-list").empty();
    }
    function showButtons(){
      $(".screen.data .data-buttons").fadeIn();
    }
    function addWorkingSet(id, name){
      var item = $("<li data-id='" + id + "'><span class='name'>" + name + "</span></li>");
      $(".screen.data #data-list").append(item);
    }


    //File selection
    function handleFileSelect(evt) {
      var file = evt.target.files[0];
      var reader = new FileReader();

      reader.onload = function(e) {
        var raw_data = e.target.result;
        var params = {
          "username" : UI.getUsername(),
          "password" : UI.getPassword(),
          "upload" : true,
          "working_set_data" : raw_data,
          "format" : $(".screen.data .formatSelect [name=format]:checked").val()
        };

        $.ajax({
          url : UTIL.CFG.api_endpoint,
          dataType: "json",
          data: JSON.stringify(params),
          type: "POST",
          contentType:"application/json",
          success : function(response){
            if(response.error){
              UI.feedback(response.message, true);
            } else {
              addWorkingSet(response.id, response.name);
            }
          },
          error: function(){
            UI.feedback("Error uploading data", true);
          }
        });
      }

      reader.readAsText(file);

    }

    
    /*
	BEGIN FUNCTIONS FOR WORKING SETS
	 */
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
		else{
			//download fresh data
			$.ajax({
				url: UTIL.CFG.api_endpoint,
				dataType: "json",
				type: "POST",
				data: JSON.stringify({
					'fetch' : true,
					'returnAllData': true,
					'working_set_id': refID,
					'format':'json'
				}),
				contentType:"application/json",
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
			url: UTIL.CFG.api_endpoint,
			dataType: "json",
			type: "POST",
			data: JSON.stringify({
				'remove' : true,
				'working_set_id': working_set_id
			}),
			contentType:"application/json",
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

	that.renameWorkingSet = function(working_set_id, new_name, callback){
		UI.toggleLoader(true);
		$.ajax({
			url: UTIL.CFG.api_endpoint,
			dataType: "json",
			type: "POST",
			data: JSON.stringify({
				'rename' : true,
				'new_name' : new_name,
				'working_set_id': working_set_id
			}),
			contentType:"application/json",
			success : function(data, stat, jqXHR){
				if(callback){
					callback.call(window);
				}
				UI.toggleLoader(false);
			},
			error: function(){
				UI.feedback("Error renaming dataset", true);
				UI.toggleLoader(false);
			}
		});
	}

	//downloads just dataset as CSV
	that.downloadDatasetCSV = function(working_set_id){
		that.getWorkingSet(working_set_id, function(working_set){
					var json = JSON.stringify(working_set);
		})
		var url = UTIL.CFG.api_endpoint + "?force_download=true&fetch=true&datasetonly=true&format=csv&username=" + UI.getUsername() + "&password=" + UI.getPassword() + "&working_set_id=" + working_set_id
		$.ajax({
			url: url,
			dataType: "text",
			type: "GET",
			contentType:"application/json",
			success : function(data, stat, jqXHR){
				download(data, "dataset.csv", "text/plain");

			},
			error: function(){
				UI.feedback("Error in downloadDatasetCSV", true);
				UI.toggleLoader(false);
			}
		});

		//var win = window.open();
		}


//downloads just dataset as JSON
	that.downloadDatasetJSON = function(working_set_id){
		that.getWorkingSet(working_set_id, function(working_set){
					var json = JSON.stringify(working_set);
		})
		var url = UTIL.CFG.api_endpoint + "?force_download=true&fetch=true&datasetonly=true&format=json&username=" + UI.getUsername() + "&password=" + UI.getPassword() + "&working_set_id=" + working_set_id
		$.ajax({
			url: url,
			dataType: "json",
			type: "GET",
			contentType:"application/json",
			success : function(data, stat, jqXHR){
				download(JSON.stringify(data,undefined,2), "dataset.json", "text/plain");

			},
			error: function(){
				UI.feedback("Error in downloadDatasetJSON", true);
				UI.toggleLoader(false);
			}
		});

		//var win = window.open();
		}


//downloads entire workflow as JSON
	that.downloadWorkingSet = function(working_set_id){
		that.getWorkingSet(working_set_id, function(working_set){
      		var json = JSON.stringify(working_set);
      		//var win = window.open("data:application/csv;charset=utf8," + encodeURIComponent(json), "_blank");

		})
		// download("hello world", "dlText.txt", "text/plain");
		var url = UTIL.CFG.api_endpoint + "?force_download=true&fetch=true&datasetonly=false&format=json&username=" + UI.getUsername() + "&password=" + UI.getPassword() + "&working_set_id=" + working_set_id
		$.ajax({
			url: url,
			dataType: "json",
			type: "GET",
			contentType:"application/json",
			success : function(data, stat, jqXHR){
				download(JSON.stringify(data,undefined,2), "workflow.json", "text/plain");

			},
			error: function(){
				UI.feedback("Error in downloadWorkingSet", true);
				UI.toggleLoader(false);
			}
		});
	}

	/*
	END FUCNTIONS FOR WORKING SETS
	 */
	
	
    that.init = function(){
      $(".screen.data #fileupload").on("change", handleFileSelect);
      $(".screen.data #data-list").delegate("li", "click", function(){
        $(".screen.data #data-list li").removeClass("selected");
        $(this).addClass("selected");
        showButtons();
      })
      $(".screen.data [data-action=load]").on("click", function(){
        var item = $(".screen.data #data-list .selected");
        if(item.size() == 0){return;}
        //get working set
        UTIL.getWorkingSet(item.attr("data-id"), function(working_set){
          MainScreen.showWorkingSet(working_set, item.html());
        });
      });
      $(".screen.data [data-action=remove]").on("click", function(){
        var item = $(".screen.data #data-list .selected");
        if(item.size() == 0){return;}
        UTIL.removeWorkingSet(item.attr("data-id"), function(){
          item.detach();
        });
      })
      $(".screen.data [data-action=export]").on("click", function(){
        var item = $(".screen.data #data-list .selected");
        if(item.size() == 0){return;}
        UTIL.downloadWorkingSet(item.attr("data-id"));
      })
      $(".screen.data [data-action=rename]").on("click", function(){
        var new_name = window.prompt("New Dataset Name");
        if(new_name.trim() == ""){
          return;
        }
        var item = $(".screen.data #data-list .selected");
        if(item.size() == 0){return;}
        UTIL.renameWorkingSet(item.attr("data-id"), new_name, function(){
          item.html(new_name);
        });
      })
    }

    return that;
}());

DataScreen.prototype = Screen;