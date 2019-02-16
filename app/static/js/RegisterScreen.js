var RegisterScreen = (function(){
    var that = {};

    that.show = function(){
      $(".screen.register").show();
    };

    that.hide = function(){
      $(".screen.register").hide();
    };

    that.init = function(){
      $("#register-btn").click(register);
      $("#register-back-btn").click(function(){UI.switchScreen("login")});
    }
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
    
    
    
    function register(){
      var uinput = $('#register-name').val();
      var pinput = $('#register-password').val();
      if (uinput){
        $.ajax({
          url : UTIL.CFG.api_endpoint,
          type: "POST",
          data : {
            "register" : true,
            "username" : uinput,
            "password" : pinput
          },
          dataType: "json",
          success : function(data, status){
            if (data.attempted) {
              if (data.taken){
                UI.feedback("Username is already taken.", true);
              } else {
                UI.setLoggedIn(true, uinput, pinput);
                UI.feedback("Welcome to SOCRATES, " + uinput + ".");
                UI.switchScreen("main");
              }
            }
          }
        });
      }else{
        console.log("No username")
        UI.feedback("Please enter a username.", true);
      }
    }
    return that;
}());

RegisterScreen.prototype = Screen;