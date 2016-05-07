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
        API.sendRequest({
          data:{
            "register" : true,
            "username" : uinput,
            "password" : pinput
          },
          success: function() {
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
        })
      } else{
        UI.feedback("Please enter a username.", true);
      }
    }
    
    
    
    function register(){
      var uinput = $('#register-name').val();
      var pinput = $('#register-password').val();
      if (uinput){
        API.sendRequest({
          data : {
            "register" : true,
            "username" : uinput,
            "password" : pinput
          },
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
      } else {
        UI.feedback("Please enter a username.", true);
      }
    }
    return that;
}());

RegisterScreen.prototype = Screen;