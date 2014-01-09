Crafty.scene("manual", function(){

  var web, location = 0;


  var html = {};
  html[0] = (function () {/*
   <div class="container manual">
   <div class="row">
   <div class="col-12">
   <a href="#" class="btn btn-lg btn-danger pull-right menu">Next</a>
   </div>
   </div>
   <div class="row">
   <div class="col-12" style="text-align:center;">
   <h1>How to Play</h1>
   </div>
   </div>
   <div class="row">
   <div class="col-12">
   <h2>Object Of The Game:</h2>
   <p>Place all 52 cards on the 81 square game board before you run out of available plays or space on the board.

   Place all of the cards on the board and you win. Good luck!</p>

   </div>
   </div>
   </div>
   */}).toString().match(/[^]*\/\*([^]*)\*\/\;*}$/)[1];

  html[1] = (function () {/*
   <div class="container manual">
   <div class="row">
   <div class="col-12">
   <a href="#" class="btn btn-lg btn-danger pull-right menu">Next</a>
   </div>
   </div>
   <div class="row">
   <div class="col-12" style="text-align:center;">
   <h1>How to Play</h1>
   </div>
   </div>
   <div class="row">
   <div class="col-12">
   <h2>General Game Play Rules:</h2>

   <p>Cards may only be played on the game board along one line per turn, either “Across” or “Down”.

   Diagonal plays are not allowed. ALL hands must be either 3, 4 or 5 cards in length. On any given turn,

   players can play either 0, 1, 2, 3, 4 or 5 cards on the board. The player can create, intersect and extend

   multiple hands per turn and they score points for every new hand created.

   At the end of each turn, the player must draw cards from the top of the draw deck equal to the number of cards they

   played during their turn.</p>

   <p>Once cards are played on the game board, they do not move until the game is over. If you cannot

   play any cards on the board, you lose.</p>
   </div>
   </div>
   </div>
   */}).toString().match(/[^]*\/\*([^]*)\*\/\;*}$/)[1];


  html[2] = (function () {/*
   <div class="container manual">
   <div class="row">
   <div class="col-12">
   <a href="#" class="btn btn-lg btn-danger pull-right menu">Next</a>
   </div>
   </div>
   <div class="row">
   <div class="col-12" style="text-align:center;">
   <h1>How to Play</h1>
   </div>
   </div>
   <div class="row">
   <div class="col-12">
   <h2>Wild Cards:</h2>

   <p>The face cards (Jacks, Queens and Kings) are wild and can represent ANY number (Ace/1 - 10) and ANY

   suit (Spades, Hearts, Clubs or Diamonds). The 12 wild cards of the game can represent different cards

   from hand to hand.</p>
   </div>
   </div>
   </div>
   */}).toString().match(/[^]*\/\*([^]*)\*\/\;*}$/)[1];


  html[3] = (function () {/*
   <div class="container manual">
   <div class="row">
   <div class="col-12">
   <a href="#" class="btn btn-lg btn-danger pull-right menu">Next</a>
   </div>
   </div>
   <div class="row">
   <div class="col-12" style="text-align:center;">
   <h1>How to Play</h1>
   </div>
   </div>
   <div class="row">
   <div class="col-12">

   <h2>How To Create Hands From The Cards:</h2>
   <p>There are seven different types of hands that can be created and played on the board and they are

   listed below with examples of each.</p>

   <div class="row" style="margin-top:70px;">
   <div class="col-6 sm">
   <p><strong>3 Cards Of The Same Rank</strong><br>

   (Three Of A Kind) – Single Play Hand (x1)</p>

   <p><strong>4 Cards Of The Same Rank</strong><br>

   (Four Of A Kind) – Double Play Hand (x2)</p>

   <p><strong>3 Consecutive Cards Of The Same Suit</strong><br>

   (Three Straight Flush) – Single Play Hand (x1)</p>

   <p><strong>4 Consecutive Cards Of The Same Suit</strong><br>
   (Four Straight Flush) – Double Play Hand (x2)</p>
   </div>
   <div class="col-6 sm">


   <p><strong>5 Consecutive Cards Of The Same Suit</strong><br>

   (Five Straight Flush) – Triple Play Hand (x3)</p>

   <p><strong>5 Consecutive Cards</strong><br>

   (Five Straight) – Double Play Hand (x2)</p>

   <p><strong>5 Cards Of The Same Suit</strong><br>

   (Five Flush) – Double Play Hand (x2)</p>
   </div>
   </div>

   </div>
   </div>
   </div>
   */}).toString().match(/[^]*\/\*([^]*)\*\/\;*}$/)[1];


  html[4] = (function () {/*
   <div class="container manual">
   <div class="row">
   <div class="col-12">
   <a href="#" class="btn btn-lg btn-danger pull-right menu">Next</a>
   </div>
   </div>
   <div class="row">
   <div class="col-12" style="text-align:center;">
   <h1>How to Play</h1>
   </div>
   </div>
   <div class="row">
   <div class="col-12">
   <h2>How To Play Hands On The Board:</h2>
   <p>There are three different ways to play the seven different types of hands on the board and they are

   listed below with examples of each.</p>

   <p><strong>Independent Hand Creation</strong><br>
   (Three Examples To The Right) – Play 3, 4 Or 5 Cards <br>
   Players can build independent hands on the board if they play at least one of their cards on one of the
   four green squares.</p>

   <p><strong>Existing Hand Intersection</strong><br>
   (Four Examples To The Left) – Play 1, 2, 3 Or 4 Cards <br>
   Players can build onto existing hands on the board by intersecting one card of any existing hand(s) to
   create a new hand.</p>

   <p><strong>Existing Hand Extension</strong><br>
   (Two Examples To The Right) – Play 1 Or 2 Cards <br>
   Players can build onto existing hands on the board by extending the end(s) of any existing hand(s) to
   create a new hand.</p>
   </div>
   </div>
   </div>
   */}).toString().match(/[^]*\/\*([^]*)\*\/\;*}$/)[1];


  html[4] = (function () {/*
   <div class="container manual">
   <div class="row">
   <div class="col-12">
   <a href="#" class="btn btn-lg btn-danger pull-right menu">Next</a>
   </div>
   </div>
   <div class="row">
   <div class="col-12" style="text-align:center;">
   <h1>How to Play</h1>
   </div>
   </div>
   <div class="row">
   <div class="col-12">
   <h2>Scoring Rules:</h2>
   <ol>
   <li>Score 10 points for every non wild card used in each new hand created.</li>
   <li>Multiply the total of each new hand created by 1, 2 or 3 based on whether each new hand is a
   single play, double play or triple play hand.
   </li>
   <li>Add X bonus points to each new hand created if any cards in the hand are played on bonus squares.
   Bonus squares count every time they are used.
   </li>
   </ol>
   <p>Players must subtract 10 points per non wild card and 50 points per wild card from their score for the

   cards they are holding at the end of the game.</p>
   </div>
   </div>
   </div>
   */}).toString().match(/[^]*\/\*([^]*)\*\/\;*}$/)[1];

  html[5] = (function () {/*
   <div class="container manual">
   <div class="row">
   <div class="col-12">
   <a href="#" class="btn btn-lg btn-danger pull-right menu">Finished</a>
   </div>
   </div>
   <div class="row">
   <div class="col-12 center">
   <h1>How to Play</h1>
   </div>
   </div>
   <div class="row">
   <div class="col-12 center">
   <h1 class="big">Good Luck!</h1>
   </div>
   </div>
   </div>
   */}).toString().match(/[^]*\/\*([^]*)\*\/\;*}$/)[1];

  var goNext = function(ent, html){
    ent.replace(html);
  };

  web = Crafty.e("Web, paper").replace(html[0]);//.addComponent('HTMLScroll');
  web.bind('menu', function(e){
    if(location >= 5){
      Crafty.scene("menu");
    }else{
      location++;
      goNext(web, html[location]);
    }
  });


});