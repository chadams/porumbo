Crafty.scene("menu", function(){

  var logo = Crafty.e("2D, Canvas, logo, uiPosition"),
    newGameBtn = Crafty.e("2D, Canvas, newGameBtn, uiPosition, uiButton"),
    continueBtn = Crafty.e("2D, Canvas, continueBtn, uiPosition, uiButton"),
    statsBtn = Crafty.e("2D, Canvas, statsBtn, uiPosition, uiButton"),
    helpBtn = Crafty.e("2D, Canvas, helpBtn, uiPosition, uiButton"),
    settingsBtn = Crafty.e("2D, Canvas, settingsBtn, uiPosition, uiButton");


  var padding = 20;
  var extraPad = 20;

  var menuActions = {
    newGame:function(obj){
      Crafty.scene('boardgame', _.extend({action:'new-game'}, obj));
    }
    ,continueGame:function(e){
      Crafty.scene('boardgame', {action:'continue-game'});
    }
  };

  var storage = $.jStorage;
  var gameData = storage.get('savedGame');

  logo.center().shift(0, padding + 80);
  newGameBtn.center(1, 2).shift(0, logo.bottom()+padding + extraPad);
  continueBtn.center(2, 2).shift(0, logo.bottom()+padding + extraPad);
  statsBtn.center(1, 2).shift(0, newGameBtn.bottom()+padding);
  helpBtn.center(2, 2).shift(0, newGameBtn.bottom()+padding);
  settingsBtn.center().shift(0, helpBtn.bottom()+ padding + 50);

  newGameBtn.makeButton('menu:newGame');
  newGameBtn.bind('menu:newGame', function(){
    if(gameData){
      window.confirm("Alert", "Starting a new game will forfeit current saved game: Are you sure?", function(){
        menuActions.newGame({forfeit:true});
      });
      return;
    }
    menuActions.newGame();
  });

  statsBtn.makeButton('menu:stats');
  statsBtn.bind('menu:stats', function(){
    Crafty.scene('stats');
  });

  settingsBtn.makeButton('menu:options');
  settingsBtn.bind('menu:options', function(){
    Crafty.scene('options');
  });


  helpBtn.makeButton('menu:manual');
  helpBtn.bind('menu:manual', function(){
    Crafty.scene('manual');
  });


  if(gameData){
    continueBtn.alpha = 1;
    continueBtn.makeButton('menu:continueGame');
    continueBtn.bind('menu:continueGame', menuActions.continueGame);
  }else{
    continueBtn.alpha = .5;
  }



});