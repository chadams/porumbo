Crafty.scene("loading", function(){


    var assetList = [];
    for(var i in Game.assets){
        assetList.push(Game.assets[i]);
    }

    Crafty.load(assetList,
        function() {
          //when loaded
          // build the sprite maps
          var suits = PoRumBo.suits;
          var numbers = PoRumBo.numbers;
          /*
          large
           var paddings = [{left:3, top:3}, {left:3, top:194}, {left:3, top:385}, {left:3, top:585}];
           var width = 139;
           var height = 184;
           */
          var paddings = [{left:2, top:2}, {left:2, top:97}, {left:2, top:191}, {left:2, top:291}];
          var width = 70;
          var height = 93;

          var cardSpriteComponents = {};


          for(var s = 0; s < suits.length; s++){
              var indx = 0;
              for(var n = 0; n < numbers.length; n++){
                  cardSpriteComponents["card_"+numbers[n]+"_"+suits[s]] = [((width*n)+paddings[s].left)-indx, paddings[s].top, width, height];
                  indx++;
              }
          }

          Crafty.sprite(Game.assets.cards, cardSpriteComponents);
          Crafty.sprite(Game.assets.cards, {deckImage:[903,130,97,129]});
          Crafty.sprite(Game.assets.board, {boardImage:[0,0,640,640]});

          //Crafty.sprite(Game.assets.bg, {bg:[0,0,640,1136]});
          Crafty.sprite(Game.assets.logo, {logo:[0,0,553,108]});

          Crafty.sprite(Game.assets.splash_board, {splash_board:[0,0,736,585]});
          Crafty.sprite(Game.assets.xplus, {xplus:[0,0,117,73]});

          Crafty.sprite(Game.assets.newGameBtn, {newGameBtn:[0,0,261,261]});
          Crafty.sprite(Game.assets.continueBtn, {continueBtn:[0,0,261,261]});
          Crafty.sprite(Game.assets.statsBtn, {statsBtn:[0,0,261,261]});
          Crafty.sprite(Game.assets.helpBtn, {helpBtn:[0,0,261,261]});
          Crafty.sprite(Game.assets.settingsBtn, {settingsBtn:[0,0,499,85]});

          var padding = 20;
          var extraPad = 20;

          var logo = Crafty.e("2D, Canvas, uiPosition, logo");
          logo.center().shift(0, 200);

          var brd = Crafty.e("2D, Canvas, splash_board");
          brd.y = Crafty.stage.elem.clientHeight - brd.h;
          if(brd.w > Crafty.stage.elem.clientWidth){
            brd.x -= brd.w - Crafty.stage.elem.clientWidth;
          }

          var xplus = Crafty.e("2D, Canvas, uiPosition, xplus");
          xplus.y = brd.y;
          xplus.x = brd.x + brd.w - xplus.w - 10;


          setTimeout(function(){
            Crafty.scene("menu"); //go to main scene
          }, 3000);


        },

        function(e) {
            //progress
            //console.log(e);
        },

        function(e) {
            //uh oh, error loading
            //console.log(e);
        }
    );
});