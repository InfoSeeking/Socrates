/* Singleton for interfacing UI, acts as a mediator for screens */
var UI = (function(){
    var that = {};
    var screens = {};
    var current_screen = null;
    var loggedIn = false;
    var username = "";
    var password = "";
    var loader_val = false;
    var loader_color = "white";

    that.isLoggedIn = function() {
        return loggedIn;
    };
    that.getUsername = function() {
        return username;
    };
    that.getPassword = function() {
        return password;
    }



    //Toggles a loading bar when content is being loaded from the server
    that.toggleLoader = function(val){

        if(val){
            loader_val = true;
            $("#loadingspinner").show();
        }
        else{
            loader_val = false;
            $("#loadingspinner").hide();
        }
    }

    //Inserts feedback message into the #feedback-text element of the screen
    // TODO: Replace with something less invasive. #feedback does not exist
    that.feedback = function(msg, err){
        alert(msg);
      // if (err){
      //   $("#feedback-text").html("<p>" + msg + "</p>");
      //   $("#feedback").removeClass("suc").addClass("err");
      //   $("#feedback").fadeIn(500);
      // } else{
      //   $("#feedback-text").html("<p>" + msg + "</p>");
      //   $("#feedback").removeClass("err").addClass("suc");
      //   $("#feedback").fadeIn(500);
      // }
    }

    // Toggle between different screens. Val function depends on context in which it is used (see LoginScreen.js/LogoutScreen.js)
    that.switchScreen = function(val){
        if(screens.hasOwnProperty(val)){
            var new_screen = screens[val];
            if(val == "login"){
                $(".screen.main, .screen.data, .screen.logout, .screen.register").hide();
            }
            /*else if(val == "register") {
                $(".screen.main, .screen.data, .screen.logout, .screen.login").hide();
            }*/
            new_screen.show();
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

        $("#data-btn, #dataset-btn").click(function(){
            if (UI.isLoggedIn()){
                UI.switchScreen("data");
            }
          });


        if(UTIL.supports_html5_storage()){
          var u = window.localStorage.getItem("username");
          var p = window.localStorage.getItem("password");
          if (u && p) {
            UI.setLoggedIn(true, u, p);
          }
        }
    };










    // Toggle some interface bits (and set local storage of window) when logged in
    that.setLoggedIn = function(val, u, p){
        loggedIn = val;
        if (val && u && p) {
            $(".screen.main .type-instructions.collection").show();
            //$("#data-btn").removeClass("inactive");
            //$("#home-btn").removeClass("inactive");
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


    return that;
}());