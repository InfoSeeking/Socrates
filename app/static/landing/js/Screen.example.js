/* Example of a screen structure */
var ExampleScreen = (function(){
    var that = {};
    //runs when the UI requests the screen to be shown
    that.show = function(){
      $(".screen.data").show();
    };
    
    that.hide = function(){
      $(".screen.data").hide();
    };

    //runs only once
    that.init = function(){

    }

    return that;
}());

ExampleScreen.prototype = Screen;