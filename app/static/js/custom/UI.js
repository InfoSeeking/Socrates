/* Singleton for interfacing UI, acts as a mediator for screens */
var UI = (function(){
    var that = {};
    var screens = {};
    var current_screen = null;
    var fbTimer = null;
    var curRefId = null;
    var loggedIn = false;
    var username = "";
    var password = "";
    var loader_val = false;
    var loader_color = "white";


    that.init = function(screen_map){
        //initialize individual screens
        screens = screen_map;
        for(var i in screens){
            if(screens.hasOwnProperty(i)){
                screens[i].init();
            }
        }

        //screen independent initialization
        $("#overlay .close").on("click", function(){
            $("#overlay").hide();
        });

        $("#refresh-btn").click(function(){
          location.reload();
        });

        $("#account-btn").click(function(){
            if (UI.isLoggedIn()){
                UI.switchScreen("logout");
            } else  {
                UI.switchScreen("login");
            }
        });

        $("#settings-btn").click(function(){
            UI.switchScreen("settings");
        });

        $("#home-btn").click(function(){
            if (UI.isLoggedIn()){
                UI.switchScreen("main");    
            }
        })

        $("#data-btn").click(function(){
            if (UI.isLoggedIn()){
                UI.switchScreen("data");
            }
          });

        $("#confirm-btn").click(confirm);

        if(UTIL.supports_html5_storage()){
          var u = window.localStorage.getItem("username");
          var p = window.localStorage.getItem("password");
          if (u && p) {
            UI.setLoggedIn(true, u, p);
          }
        }
    };

    // Toggle between different screens. Val function depends on context in which it is used (see LoginScreen.js/LogoutScreen.js)
    that.switchScreen = function(val){
        if(screens.hasOwnProperty(val)){
            var new_screen = screens[val];
            new_screen.show();
            if(current_screen && current_screen != new_screen){
                current_screen.hide();
            }
            current_screen = new_screen;
        } else {
            throw "Screen " + val + " does not exist";
        }
    };
    
    /*
    show overlay with html and center. Overlaid on top of current screen (see example usage in MainScreen.js)
    */
    that.overlay = function(html, classname, title){
      $("#overlay span").html(title).removeClass().addClass(classname);
      $("#overlay .content").empty().html(html);
      $("#overlay").fadeIn();
    }

    that.toggleLoader = function(val){
        function animate(){
            $("#loader #fill").width(0).animate({
                "width": "100%"
            }, 1000, function(){
                if(loader_val){
                    //switch color
                    if(loader_color == "white"){
                        loader_color = "blue";
                        $("#loader").css({
                            "background" : "#00aeef"
                        });
                        $("#loader #fill").css({
                            "background" : "#ffffff"
                        });
                    } else {
                        loader_color = "white";
                        $("#loader").css({
                            "background" : "#ffffff"
                        });
                        $("#loader #fill").css({
                            "background" : "#00aeef"
                        });
                    }
                    //animate again
                    animate();
                }
            });
        }
        if(val){
            loader_val = true;
            $("#loader").show();
            animate()
        }
        else{
            loader_val = false;
            $("#loader").fadeOut();
        }
    }

    that.showError = function(message){
        window.clearTimeout(fbTimer);
        fbTimer = window.setTimeout(function(){$("#feedback").fadeOut()}, 10000);
        $("#feedback").fadeIn().html(message).removeClass("suc").addClass("err");
    }

    that.feedback = function(msg, err){
      if (err){
        $("#feedback-text").html("<p>" + msg + "</p>");
        $("#feedback").removeClass("suc").addClass("err");
        $("#feedback").fadeIn(500);
      } else{
        $("#feedback-text").html("<p>" + msg + "</p>");
        $("#feedback").removeClass("err").addClass("suc");
        $("#feedback").fadeIn(500);
      }
    }

    that.setLoggedIn = function(val, u, p){
        loggedIn = val;
        if (val && u && p) {
            $("#data-btn").removeClass("inactive");
            $("#home-btn").removeClass("inactive");
            username = u;
            password = p;
            if(UTIL.supports_html5_storage()){
                window.localStorage.setItem("username", u);
                window.localStorage.setItem("password", p);
            }
        } else {
            $("#data-btn").addClass("inactive");
            $("#home-btn").addClass("inactive");
            if(UTIL.supports_html5_storage()){
                window.localStorage.removeItem("username");
                window.localStorage.removeItem("password");
            }
        }
    };

    that.isLoggedIn = function() {
        return loggedIn;
    };

    that.getUsername = function() {
        return username;
    };
    that.getPassword = function() {
        return password;
    }


    function confirm(){
        $("#feedback-text").html("");
        $("#feedback").hide();
    }

    return that;
}());