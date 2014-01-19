var Game = {

  w:640
  ,h:960

  ,start:function(){

    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      width = w.innerWidth || e.clientWidth || g.clientWidth,
      height = w.innerHeight|| e.clientHeight|| g.clientHeight;



    var retina = window.devicePixelRatio > 1;


    if(retina){
      Crafty.init(width, height);
    }else{
      //Crafty.init(this.w, this.h);
      Crafty.init(width, height);
    }


    var viewport = document.querySelector("meta[name=viewport]");
    if(true){
      viewport.setAttribute('content', 'width=device-width; initial-scale=0.5; maximum-scale=0.5; minimum-scale=0.5; user-scalable=no;');
    }



    //viewport.setAttribute('content', 'width=device-width; initial-scale=1; maximum-scale=1; user-scalable=no;');
    Crafty.scene("loading");
  }

  ,assets : {
    cards:"assets/PlayingCardsSmall.png"
    ,board:"assets/Board.jpg"
    ,splash_board:"assets/splash/splash_board.png"
    ,xplus:"assets/splash/x+.png"
    ,logo:"assets/splash/logo.png"
    ,newGameBtn:"assets/buttons/NewGame.png"
    ,continueBtn:"assets/buttons/SavedGame.png"
    ,statsBtn:"assets/buttons/GameStats.png"
    ,helpBtn:"assets/buttons/Tutorial.png"
    ,settingsBtn:"assets/buttons/SettingsButton.png"
  }


};



// replace confirm
var _old_confirm = window.confirm;
window.confirm = function(title, message, callback, buttonLabels){
  if(navigator && navigator.notification){
    navigator.notification.confirm(
      message,      // message
      function(res){
        if(res === 1){
          callback()
        }
      },     // callback to invoke with index of button pressed
      title,        // title
      buttonLabels  // buttonLabels (OK,Cancel)
    );
    return;
  }
  // use old confirm
  var res = _old_confirm(message);
  if(res){
    callback();
  }
};

// replace alert
var _old_alert = window.alert;
window.alert = function(title, message, callback, buttonName){
  if(navigator && navigator.notification){
    navigator.notification.alert(
      message,      // message
      function(){
        callback()
      },     // callback to invoke with index of button pressed
      title,        // title
      buttonName  // buttonName (OK)
    );
    return;
  }
  // use old confirm
  var res = _old_alert(message);
  callback();
};