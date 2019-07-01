/*
 * Controls the log out functionality of the landing page (static/landing/index.html)
 */

var LogoutScreen = (function(){
    var that = {};
    that.show = function(){
      $(".screen.logout").show().find(".username").html(UI.getUsername());
    };

    that.hide = function(){
      $(".screen.logout").hide();
    };

    that.init = function(){
        $("#logout-btn").click(function(){
            logOut();
        })
    }

    // Logs out (see UI.js for more implementation details). Toggles parts of user interface CSS accordingly
    function logOut(){
      UI.setLoggedIn(false);
      UI.feedback("Logged out");
      UI.switchScreen("login");
      //clear workspace, get rid of buttons, and show intro message
      var count = $('.results.analysis').length //counts how many analyses there are
      if (count!=0){
        $('.results.analysis').remove();
        $("#entireworkflow").css("display", "none");
      }
      var ct = $('.results.collection').length //counts how many collections there are
      if (ct!=0){
        $('.results.collection').remove();
        $("#datasetjson").css("display", "none");
        $("#datasetcsv").css("display", "none");
      }
      $("#workspace #intro").show();
    }
    return that;
}());

LogoutScreen.prototype = Screen;
