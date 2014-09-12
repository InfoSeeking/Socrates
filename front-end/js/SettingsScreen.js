var SettingsScreen = (function(){
    var that = {};
    that.show = function(){
      $(".screen.settings").show();
    };
    
    that.hide = function(){
      $(".screen.settings").hide();
    };
    
    that.init = function(){

    }

    return that;
}());

SettingsScreen.prototype = Screen;