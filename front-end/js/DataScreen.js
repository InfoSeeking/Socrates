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
    function showButtons(){
      $(".screen.data .data-buttons").fadeIn();
    }
    function addWorkingSet(id, name){
      var item = $("<li data-id='" + id + "'><span class='name'>" + name + "</span></li>");
      $(".screen.data #data-list").append(item);
    }
    that.hide = function(){
      $(".screen.data").hide();
    };

    that.init = function(){
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
    }

    return that;
}());

DataScreen.prototype = Screen;