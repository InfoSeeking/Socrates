/*
 *
 * Screen for handling data-related things on main user UI:
 * - Your Datasets
 * - Import Data/Select File
 * - Load, Rename, Export, Remove
 *
 */

var DataScreen = (function(){
    var that = {};


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


    // "Select File" functionality.  Reads a file, uploads it to the server, then updates the list of available files in the "Your Datasets" interface
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





    that.init = function(){
      $(".screen.data #fileupload").on("change", handleFileSelect);
      $(".screen.data #data-list").delegate("li", "click", function(){
        $(".screen.data #data-list li").removeClass("selected");
        $(this).addClass("selected");
        showButtons();
      });

      $(".screen.data [data-action=load]").on("click", function(){
        var item = $(".screen.data #data-list .selected");
        if(item.size() == 0){return;}
        //get working set
        MainScreen.getWorkingSet(item.attr("data-id"), function(working_set){
          MainScreen.showWorkingSet(working_set, item.html());
        });
      });

      $(".screen.data [data-action=remove]").on("click", function(){
        var item = $(".screen.data #data-list .selected");
        if(item.size() == 0){return;}
        MainScreen.removeWorkingSet(item.attr("data-id"), function(){
          item.detach();
        });
      })
      $(".screen.data [data-action=export]").on("click", function(){
        var item = $(".screen.data #data-list .selected");
        if(item.size() == 0){return;}
        MainScreen.downloadWorkingSet(item.attr("data-id"));
      })
      $(".screen.data [data-action=rename]").on("click", function(){
        var new_name = window.prompt("New Dataset Name");
        if(new_name.trim() == ""){
          return;
        }
        var item = $(".screen.data #data-list .selected");
        if(item.size() == 0){return;}
        MainScreen.renameWorkingSet(item.attr("data-id"), new_name, function(){
          item.html(new_name);
        });
      })
    }

    return that;
}());

DataScreen.prototype = Screen;