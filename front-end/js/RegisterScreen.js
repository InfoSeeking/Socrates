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
    
    function register(){
      var uinput = $('#register-name').val();
      username = uinput.toLowerCase();
      if (username){
        console.log("Attempting to register as: " + username);
        $.ajax({
          url : UTIL.CFG.api_endpoint + "resume/" + username,
          dataType: "json",
          success : function(data, status){
            if (data.length > 0){
              console.log(data);
              UI.feedback("Username is already taken.", true);
              console.log("Username already taken.");
            } else {
              console.log(data);
              console.log(status);
              console.log("New user registered as: " + username);
              loggedIn = true;
              UI.feedback("Welcome to SOCRATES, " + uinput + ".");
              UI.switchScreen("main");
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