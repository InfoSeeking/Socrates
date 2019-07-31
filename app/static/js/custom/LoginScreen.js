/*
 * Controls the log in functionality of the landing page (static/landing/app.html)
 */

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
            that.logIn();
        })
        $("#login-register-btn").click(function(){
            UI.switchScreen("register");
        })
    }


    // Attempt login.  If successful, redirect to user interface (/app endpoint). Otherwise, print out a corresponding error.
	that.logIn = function(){
      var uinput = $('#login-name').val();
      var pinput = $('#login-password').val();
      if (uinput){
        $.ajax({
            url : UTIL.CFG.api_endpoint,
            type : "POST",
            data : JSON.stringify({
                "username" : uinput,
                "password" : pinput
            }),
            dataType: "json",
            contentType: "application/json",
            success : function(data, status){
                if (data.error){
                    alert("Wrong username or password.");
                }
                else {
                    UI.setLoggedIn(true, uinput, pinput);
                    window.location.href = UTIL.CFG.ui_endpoint;
                    $(".screen.logout").show();

                }
            }
        });
      }else{
          UI.feedback("Please enter a username.", true);
      }
    }
    return that;
}());

// LoginScreen is a subclass of Screen
LoginScreen.prototype = Screen;