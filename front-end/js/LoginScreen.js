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
            logIn();
        })
        $("#login-register-btn").click(function(){
            UI.switchScreen("register");
        })
    }

    function logIn(){
      var uinput = $('#username').val();
      username = uinput.toLowerCase();
      if (username){
        console.log("Attempting to log in as: " + username);
        $.ajax({
          url : UTIL.CFG.api_endpoint + "resume/" + username,
          dataType: "json",
          success : function(data, status){
            if (data.length > 0){
              for (var i = 0; i < data.length; i++) {
                addData(data[i]['setname'], data[i]['working_set_id'],"collection");
              }
              console.log(data);
              console.log(status);
              UI.setLoggedIn(true);
              UI.feedback("Welcome back," + uinput + ".");
              UI.switchScreen("main");
            } else {
              console.log(data);
              UI.feedback("Username not found.", true);
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

LoginScreen.prototype = Screen;