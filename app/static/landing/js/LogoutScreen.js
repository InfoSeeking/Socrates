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

    function logOut(){
      UI.setLoggedIn(false);
      UI.feedback("Logged out");
      UI.switchScreen("login");
    }
    return that;
}());

LogoutScreen.prototype = Screen;