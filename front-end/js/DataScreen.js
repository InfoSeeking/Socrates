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
          console.log(data);
          for(var i = 0; i < data.ids.length; i++){
            addWorkingSet(data.ids[i]["id"], data.ids[i]["name"]);
          }
        }
      })
    };
    
    function clearList(){
      $(".screen.data #data-list").empty();
    }
    function addWorkingSet(id, name){
      var item = $("<li data-id='" + id + "'> " + name + "</li>");
      $(".screen.data #data-list").append(item);
    }
    that.hide = function(){
      $(".screen.data").hide();
    };

    that.init = function(){

    }

    return that;
}());

DataScreen.prototype = Screen;