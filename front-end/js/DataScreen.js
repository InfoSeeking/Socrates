var DataScreen = (function(){
    var that = {};
    that.show = function(){
      $(".screen.data").show();
      $.ajax({
        url: UTIL.CFG.api_endpoint,
        type : "POST",
        dataType: "json",
        data : {
          "username" : UI.getUsername(),
          "password" : UI.getPassword(),
          "fetch_all_ids" : true
        },
        success: function(data, jqxhr){
          clearList();
          for(var i = 0; i < data.ids.length; i++){
            addWorkingSet(data.ids[i]["id"], data.ids[i]["name"], data.ids[i]["function"]);
          }
        }
      })
    };
    
    function clearList(){
      $(".screen.data #data-list").empty();
    }
    function addWorkingSet(id, name){
      var item = $("<li data-id='" + id + "'><span class='name'>" + name + "</span><span data-action='remove'>Remove</span><span data-action='load'>Load</span></li>");
      $(".screen.data #data-list").append(item);
    }
    that.hide = function(){
      $(".screen.data").hide();
    };

    that.init = function(){
      $(".screen.data #data-list").delegate("[data-action=load]", "click", function(){
        var item = $(this).parent();
        //get working set
        UTIL.getWorkingSet(item.attr("data-id"), function(working_set){
          MainScreen.showWorkingSet(working_set, item.html());
        });
      });
      $(".screen.data #data-list").delegate("[data-action=remove]", "click", function(){
        var item = $(this).parent();
        UTIL.removeWorkingSet(item.attr("data-id"), function(){
          item.detach();
        });
      })
    }

    return that;
}());

DataScreen.prototype = Screen;