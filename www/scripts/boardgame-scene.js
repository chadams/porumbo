Crafty.scene("boardgame", function(params){
  "use strict"

  var bg = Crafty.e("2D, Canvas, bg"),
    topPadding = 35,
    pad1 = 3, // minor padding
    pad2 = 40, // major padding
    stats,
    board, deck, player1, score, gameManager, storage, options, saveGame, clearSavedGame, forfeitGame, winGame;

  board = Crafty.e("Board");
  board.addComponent('uiPosition');
  board.center();
  board.y += 80 + topPadding; // position the board

  deck = Crafty.e("Deck");
  // position deck
  deck.y = board.h + board.y + pad2;
  deck.x = (board.x + board.w) - deck.w - pad1;

  /*
   var discard = Crafty.e("Discard");
   // position discard
   discard.y = deck.y;
   discard.x = deck.x - discard.w - pad1;
   */

  player1 = Crafty.e("Hand").addComponent("player1");
  player1.y = board.y + board.h + pad2;
  player1.x = board.x + pad1;

  score = Crafty.e("Score");
  score.addComponent('uiPosition');
  score.center();
  score.y = board.y - 30;

  // for saving
  storage = $.jStorage;

  // stats
  stats = GameStatistics(storage);



  // scene methods
  saveGame = function(storage){
    var gameState = gameManager.serialize();
    gameState.date = new Date().getTime();
    storage.set('savedGame', {savedGame:gameState});
    //console.log(gameState);
    return gameState;
  }.bind(this, storage);

  clearSavedGame = function(storage){
    storage.deleteKey('savedGame');
  }.bind(this, storage);

  forfeitGame = function(stats){
    var gameState = gameManager.serialize();
    var hand = gameState.hands[gameState.currentPlayer];
    var deckCardsLeft = gameState.deck.length;
    var cardsInHand = hand.cards.length;
    var cardsLeft = deckCardsLeft + cardsInHand;
    if(cardsLeft > 0){ // only save if it's a lose, wins have already been saved
      stats.addPlay(hand.points, cardsLeft).save();
    }
  }.bind(this, stats);

  winGame = function(stats){
    var gameState = gameManager.serialize();
    var hand = gameState.hands[gameState.currentPlayer];
    stats.addPlay(hand.points, 0).save();
    window.alert('You Win!', 'Winning Final Score: '+hand.points, function(){
      clearSavedGame();
    });
  }.bind(this, stats);



  // start the game
  gameManager = Crafty.e("GameManager");
  gameManager.setup({
    deck:deck
    //,discard:discard
    ,board:board
    ,numbers:PoRumBo.numbers
    ,suits:PoRumBo.suits
    ,hands:[player1]
    ,logic:PoRumBo
  });
  // this is called when the device "pause" is triggered (on native device)
  // so that user doesn't lose game when getting a call or multitasking
  gameManager.bind('game:pause', function(){
    saveGame();
    Crafty.scene("menu");
  });

  gameManager.bind('game:win', function(){
    winGame();
  });

  options = Crafty.e("GameMenu");
  options.y += topPadding;




  if(params.action === 'new-game'){
    gameManager.clearGame();
    gameManager.makeGame();
  }else if(params.action === 'continue-game'){
    var gameData = storage.get('savedGame');
    gameManager.unserialize(gameData.savedGame);

  }


  // EVENTS
  // saves a quit statistic
  options.bind('quit', function(e){
    window.confirm('Forfeit Game', 'Are you sure?', function(){
      forfeitGame();
      clearSavedGame();
      Crafty.scene("menu");
    });
  });

  // moves to game menu
  options.bind('menu', function(e){
    saveGame();
    Crafty.scene("menu");
  });






});
