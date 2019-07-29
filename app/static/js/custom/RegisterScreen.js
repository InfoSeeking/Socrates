/*
 * Screen for handling Registration
 */
var RegisterScreen = (function(){
    var that = {};

    that.show = function(){
      $(".screen.register").show();
    };

    that.hide = function(){
      $(".screen.register").hide();
    };


    that.register = function(uinput, pinput){
      if (uinput){
        $.ajax({
          url : UTIL.CFG.api_endpoint,
          type: "POST",
          data : JSON.stringify({
            "register" : true,
            "username" : uinput,
            "password" : pinput
          }),
          contentType: "application/json",
          dataType: "json",
          success : function(data, status){
            if (data.attempted) {
              if (data.taken){
                alert("Username is already taken.");
              } else {
                UI.setLoggedIn(true, uinput, pinput);
                console.log("Registration successful");
                alert("Registration successful! Page will refresh, please login after");
                location.reload();
              }
            }
          }
        });
      }else{
        alert("Please enter a username.");
      }
    }

    that.init = function(){
      //$("#register-btn").click(that.register);
      $("#register-back-btn").click(function(){UI.switchScreen("login")});
    }




    return that;
}());

RegisterScreen.prototype = Screen;