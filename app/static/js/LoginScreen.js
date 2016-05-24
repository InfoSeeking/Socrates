var LoginScreen = (function(){
  var that = {};
  that.show = function(){
    $(".screen.login").show();
  };
  
  that.hide = function(){
    $(".screen.login").hide();
  };

  that.init = function(){
      $("#login-submit-btn").click(function(){
          var uinput = $('#login-name').val();
          var pinput = $('#login-password').val();
          that.logIn(uinput, pinput);
      })
      $("#login-register-btn").click(function(){
          UI.switchScreen("register");
      })
  }
  that.logIn = function(uinput, pinput, onError){
    if (uinput){
      API.sendRequest({
        data: {username: uinput, password: pinput},
        success : function(data){
            UI.setLoggedIn(true, uinput, pinput);
            UI.feedback("Welcome back," + uinput + ".");
            UI.switchScreen("main");
        },
        error: function(data) {
          UI.feedback(data.message, true);
          if (onError) onError(data.message);
        }
      });
    } else {
      UI.feedback("Please enter a username.", true);
    }
  }
  return that;
}());

LoginScreen.prototype = Screen;