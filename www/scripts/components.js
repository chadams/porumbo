// A Card is a sprite that can change it's suit and number
Crafty.c('Card', {

    init: function() {
        this.requires('2D, Canvas, Tweener, CardStatus, Draggable')
            .addComponent("card_A_C");

        var self = this;
        this.bind("StartDrag", function(e){
            Crafty.trigger("CardStartDrag", {event:e, card:self});
            self.rotation = 0;
            self.scale(1);
        });

        this.bind("StopDrag", function(e){
            Crafty.trigger("CardDropped", {event:e, card:self});
        });

        this.originalWidth = this.w;
        this.originalHeight = this.h;

        // set origin
        var x = this.w/2;
        var y = this.h/2;
        this.origin(x, y);

        this.number = 'A';
        this.suit = "C";
    }

    ,_setCard:function(number, suit){
        var current = this._getComponentName();
        this.removeComponent(current);
        this.number = number;
        this.suit = suit;
        this.addComponent(this._getComponentName());
    }

    ,_getComponentName:function(){
        return "card_"+this.number+"_"+this.suit;
    }

    ,setCard:function(number, suit){
        this._setCard(number, suit);
    }

    ,moveTo:function(x, y, speed, delay){
        speed = speed || 50;
        delay = delay || 0;
        delay = delay * 1000;
        var self = this;
        this.timeout(function(){
            self.addTween({x:x, y:y}, "easeOutExpo", speed);
        }, delay);
    }

    ,getCenterPoint:function(){
        var x = this.x + (this.w/2);
        var y = this.y + (this.h/2);
        return {x:x, y:y};
    }


    ,scale:function(percent){
        this.w = this.originalWidth * percent;
        this.h = this.originalHeight * percent;
    }

    ,serialize:function(){
      return {
        "number":this.number
        ,"suit":this.suit
        ,"x":this._x
        ,"y":this._y
        ,"w":this._w
        ,"h":this._h
      }
    }

});

Crafty.c("CardStatus", {
   init:function(){
     this.setState(this.state);
     this.hand = null;// the playerhand that is holding this card, or null
     this.state = "new"; // new | hand | board | played | discarded
   }

   ,setState:function(state){
     this.removeComponent("CARD_STATE_"+this.state);
     this.state = state;
     this.addComponent("CARD_STATE_"+this.state);
   }



});


Crafty.c("2dHelper", {
    init:function(){}

    //returns the position of an entity if it were centered over this entity
    ,getPositionOfEntityIfCentered:function(e){
        var x = (this.x + (this.w/2)) - (e.w/2);
        var y = (this.y + (this.h/2)) - (e.h/2);
        return {x:x, y:y}
    }
});


Crafty.c('Board', {

    init: function() {
        this.requires('2D, Canvas, boardImage');
        //this.bind("CardDropped", this._onCardDropped);
        this.bind("CardStartDrag", this._onCardStartDrag);
        this.spaces = []; // holds cardEntities on board
    }





    ,_getRecAtIndex:function(index){
        var squareSize = this.w/9;
        var x = (index % 9) * squareSize;
        var y = parseInt(index / 9) * squareSize;
        x += this.x;
        y += this.y;
        /*var center = {};
        center.x = x+(squareSize/2);
        center.y = y+(squareSize/2);  */
        var rect = {x:x, y:y, w:squareSize, h:squareSize};
        return rect;
    }

    ,_getIndexOfLocationPoint:function(point){
        point.x += -this.x;
        point.y += -this.y;
        var squareSize = this.w/9;
        var x = parseInt(point.x/squareSize);
        var y = parseInt(point.y/squareSize);
        var index = (y*9)+x;
        return index;
    }

    ,_getIndexOfCard:function(card){
        var point = card.getCenterPoint();
        return this._getIndexOfLocationPoint(point);
    }

    ,_cardAtIndex:function(index){
        var atIndex = !!this.spaces[index];
        //console.log("card at index:"+index+" :: "+atIndex);
        return atIndex;
    }

    ,_returnCardToHand:function(card){
        card.setState("hand");
        this.detach(card);
        card.hand.attach(card);
        card.scale(1);
        card.hand.animateToHand(card);
    }

    // removed the cardEntity reference from board spaces
    ,_removeCardFromBoard:function(card){
        if(card.state !== 'board')
            return;
        this.spaces[this._getIndexOfCard(card)] = null;
    }

    ,_addCardToBoardAtIndex:function(card, index){
        //console.log("Adding Card:", card, index);
        if(card.hand) card.hand.detach(card);
        this.attach(card);
        this.spaces[index] = card;
        card.setState("board");
        // drop card on space visually
        var rec = this._getRecAtIndex(index);
        card.scale(.75);
        card.x = rec.x + ((rec.w/2) - (card.w/2));
        card.y = rec.y;
    }

    ,_onCardDropped:function(e){
        var card = e.card;
        this.dropCard(card);
    }

    ,dropCard:function(card){
        // first see if we dropped on the board
        if(!this.intersect(card)){
            this._returnCardToHand(card);
            return;
        }
        var index = this._getIndexOfCard(card);

        if(index > 80){
            this._returnCardToHand(card);
            return;
        }

        // see if there is a card at location
        if(this._cardAtIndex(index)){
            this._returnCardToHand(card);
            return;
        }
//console.log("card added to index:"+index);
        // add card to spaces
        this._addCardToBoardAtIndex(card, index);

    }

    ,_onCardStartDrag:function(e){
        var card = e.card;
        // first see if are on the board
        if(!this.intersect(card)){
            return;
        }
        var point = card.getCenterPoint();
        var index = this._getIndexOfLocationPoint(point);

        // see if there is a card at location
        if(this._cardAtIndex(index)){
            this._removeCardFromBoard(card);
        }
    }

    // cards that were just dropped on board, ready to be played
    ,_getActiveCards:function(){
       var list = [];
       for(var i = 0; i < this.spaces.length; i++){
          if(this.spaces[i] && this.spaces[i].state === "board"){
             list.push(this.spaces[i]);
          }
       }
        return list;
    }

    ,cancelPlay:function(){
       var list = this._getActiveCards();
        for(var i = 0; i < list.length; i++){
            this._removeCardFromBoard(list[i]);
            this._returnCardToHand(list[i]);
        }
    }

    ,applyPlay:function(){
        var list = this._getActiveCards();
        for(var i = 0; i < list.length; i++){
            var card = list[i];
            card.setState("played");
            card.disableDrag();
        }
    }

    ,serialize:function(){
        var positions = [];
        var currentPlay = [];
        var makeCardData = function(card, index){
            return {number:card.number, suit:card.suit, state:card.state, index:index};
        };
        var cases = {
            board : function(card, i){ // active play
                positions[i] = makeCardData(card, i);
                currentPlay.push(positions[i]);
            }
            ,played : function(card, i){ // already played
                positions[i] = makeCardData(card, i);
            }
        };
        for(var i = 0; i < this.spaces.length; i++){
            var card = this.spaces[i];
            if(card){
               cases[card.state] ? cases[card.state](card, i) : 0;
            }
        }
        var result = {positions:positions, currentPlay:currentPlay};
        return result;
    }

    ,unserialize:function(data){
      for(var i = 0; i < data.positions.length; i++){
        var pos = data.positions[i];
        if(!pos) continue;
        if(pos.state === 'played'){
          var card = Crafty.e('Card');
          card.setCard(pos.number, pos.suit);
          this._addCardToBoardAtIndex(card, i);
          card.setState(pos.state);
          card.disableDrag();
        }
      }
    }


});



Crafty.c('Deck', {

    init: function() {
      this.requires('2D, Canvas, 2dHelper, deckImage, Mouse');
      this.bind("Click", this._onClick);
      //label
      this.label = Crafty.e('2D, DOM, Text')
          .unselectable()
          .textColor("#ffffff", 1)
          .textFont({
              size:'40px'
          })
          .css({'text-align':'center'});
      this.label.y = (this.h/2) - (20);
      this.label.w = this.w;
      this.attach(this.label);
      this._deck = [];
    }


    ,_onClick:function(e){
        Crafty.trigger("SubmitPlay");
    }

    ,numCardsLeft:function(){
        return this._deck.length;
    }

    ,_updateCount:function(){
        this.label.text(this.numCardsLeft());
    }

    ,buildDeck:function(numbers, suits){
        for(var n = 0; n < numbers.length; n++){
            for(var s = 0; s < suits.length; s++){
                this._deck.push({
                    number:numbers[n]
                    ,suit:suits[s]
                });
            }
        }
        this._updateCount();
    }

    ,_shuffle:function(seed){
        var temp,j;

        for(var i=0; i<this._deck.length; i++){
            // Select a "random" position.
            j = (seed % (i+1) + i) % this._deck.length;

            // Swap the current element with the "random" one.
            temp=this._deck[i];
            this._deck[i]=this._deck[j];
            this._deck[j]=temp;

        }
    }

    ,shuffleDeck:function(seed){
        if(!seed)
            seed = Crafty.math.randomInt(1000, 9876543210);

        this._shuffle(seed);
    }

    ,drawCard:function(){
        var card = this._deck.pop();
        this._updateCount();
        return card;
    }

    ,serialize:function(){
      return _.cloneDeep(this._deck);
    }

    ,unserialize:function(data){
      var savedDeck = _.cloneDeep(data);
      this._deck = savedDeck;
      this._updateCount();
    }


});


Crafty.c('GameManager', {

    init: function() {
        this.requires('2D');
        Crafty.bind("SubmitPlay", this.submitPlay.bind(this)); // TODO: prevent double tap
        Crafty.bind("DrawNewCards", this.drawNewCards.bind(this));
        this.bind("CardDropped", this._onCardDropped);

        this.currentPlayer = 0;

        this.deck = null; // reference to the deck entity
        this.board = null; // reference to the board entity
        this.discard = null; // reference to discard entity
        this.hands = []; // list of hand entities

        this.numbers = []; // numbers to use
        this.suits = []; // card suits to use


    }

    ,setup:function(obj){
        for(var i in obj){
            this[i] = obj[i];
        }
    }

    ,clearGame:function(){

    }

    ,makeGame:function(){

        // init deck
        this.deck.buildDeck(this.numbers, this.suits);
        this.deck.shuffleDeck();


        var hand = this.getCurrentPlayerHand();
        this.dealCards(hand);

    }

    ,submitPlay:function(){
        var gameState = this.board.serialize();
        var play = this.logic.submitPlay(gameState);
        var isValid = play.isValid;
        if(!isValid){
            // return the cards to hand
            this.board.cancelPlay();
            return;
        }
        // play is valid
        this.board.applyPlay();
        // apply score
        var hand = this.getCurrentPlayerHand();
        hand.addPoints(play.points);
        Crafty.trigger("UpdateScore", hand.getScore());
        this.drawNewCards();
        this.checkForGameWin();
    }

    ,checkForGameWin:function(){
      var hand = this.getCurrentPlayerHand();
      var deckCardsLeft = this.deck.numCardsLeft();
      var cardsInHand = hand.handSize();
      var cardsLeft = deckCardsLeft + cardsInHand;
      if(cardsLeft <= 0){
        this.trigger('game:win');
        return true;
      }
      return false;
    }

    ,drawNewCards:function(){
        // draw up to hand size
        var hand = this.getCurrentPlayerHand();
        hand.cleanHand(); // removes the cards played on the board
        this.dealCards(hand);
    }

    ,getCurrentPlayerHand:function(){
        return this.hands[this.currentPlayer];
    }

    ,dealCards:function(hand){
        // deal a hand of cards
        var waitTime = .25;
        var index = 0;
        while(hand.handSize() < hand.maxCardsInHand && this.deck.numCardsLeft() > 0){
            var card = this.deck.drawCard();
            var cardEntity = Crafty.e("Card");
            var pos = this.deck.getPositionOfEntityIfCentered(cardEntity);
            cardEntity.x = pos.x;
            cardEntity.y = pos.y;
            cardEntity.setCard(card.number, card.suit);
            var hpos =  hand.getPositionOfCardInHand(cardEntity);
            cardEntity.setState("hand");
            hand.addCard(cardEntity).animateToHand(cardEntity, 100, index *.25);
            index++;
        }
    }

    ,_onCardDropped:function(e){
        //console.log("debug:onCardDropped");
        var card = e.card, i;

        var target, targets = ['board', 'discard'];
        for(i = 0; i < targets.length; i++){
            target = this[targets[i]];
            if(target && target.intersect(card)){
                var res = target.dropCard(card);
                return;
            }
        }

        //else just return the card, it wasn't dropped on anything useful
        for(i = 0; i < targets.length; i++){
            target = this[targets[i]];
            if(target)
                target.detach(card);
        }
        card.setState("hand");
        card.hand.attach(card);
        card.scale(1);
        card.hand.animateToHand(card);
    }

    ,serialize:function(){
      var deck = this.deck.serialize();
      var hands = [];
      for(var i = 0; i < this.hands.length; i++){
        hands.push(this.hands[i].serialize());
      }
      var board = this.board.serialize();

      return {
        "deck":deck
        ,"hands":hands
        ,"currentPlayer":this.currentPlayer
        ,"board":board
      };
    }

    ,unserialize:function(data){
      this.currentPlayer = data.currentPlayer;
      this.deck.unserialize(data.deck);
      var hands = [];
      for(var i = 0; i < data.hands.length; i++){
        this.hands[i].unserialize(data.hands[i]);
      }
      Crafty.trigger("SetScore", this.hands[this.currentPlayer].getScore());
      this.board.unserialize(data.board);

    }




});


Crafty.c('Hand', {

    init:function(){
      this.requires('2D, Canvas');


      this.spacingH = 10;
      this.spacingV = 70;

      this.maxCardsInHand = 8;
      this.baseZIndex = 400;

      this.points = 0;

      this._hand = []; // the card entities in my hand
      this._reset();

    }



    ,_reset:function(){
        this.points = 0;
        // size hand to max cards
        this._hand.length = 0;
        for(var i = 0; i < this.maxCardsInHand; i++){
            this._hand.push(null);
        }
    }

    ,addPoints:function(points){
        this.points += points;
    }

    ,getScore:function(){
        return this.points;
    }

    ,handSize:function(){
        var cnt = 0;
        for(var i = 0; i < this._hand.length; i++){
            if(this._hand[i]){
                cnt++;
            }
        }
        return cnt;
    }

    ,getNextEmptyPosition:function(){
        var cnt = 0;
        for(var i = 0; i < this._hand.length; i++){
            if(this._hand[i] === null){
                return i;
            }
        }
        return false;
    }

    ,getIndexOfCard:function(cardEntity){
        for(var i = 0; i < this._hand.length; i++){
            if(cardEntity === this._hand[i]){
                return i;
            }
        }
        return this._hand.length;
    }

    // returns x,y of where this card should sit in the players hand
    // x,y is based off the hand array index position
    ,getPositionOfCardInHand:function(cardEntity){
       var index = this.getIndexOfCard(cardEntity);
       var y = index < 4 ? 0 : this.spacingV;
       var pad1 = 3;
       var offset = index < 4 ? 0 : 20;
       var x =  this.x + ((cardEntity.w + this.spacingH) * (index % 4));
       x += pad1 + offset;
       y += this.y;
       return {x:x, y:y};
    }

    ,animateToHand:function(cardEntity, speed, delay){
        var pos = this.getPositionOfCardInHand(cardEntity);
        cardEntity.moveTo(pos.x, pos.y, speed, delay);
    }

    ,addCard:function(cardEntity){
        cardEntity.setState("hand");
        var index = this.getNextEmptyPosition();
        cardEntity.z = index + this.baseZIndex;
        this._hand[index] = cardEntity;
        this.attach(cardEntity);
        cardEntity.hand = this;
        return this;
    }

    // cleans out the cards that were laid on the board and played
    ,cleanHand:function(){
        for(var i = 0; i < this._hand.length; i++){
            if(this._hand[i].state !== 'hand'){
                this._hand[i] = null;
            }
        }
    }

    ,serialize:function(){
      var cards = [];
      for(var i = 0; i < this._hand.length; i++){
        cards.push(this._hand[i].serialize());
      }
      return {
        "cards":cards
        ,"points":this.points
      };
    }

    ,unserialize:function(data){
      this._reset();
      var cards = data.cards;
      this.points = data.points;
      for(var i = 0; i < cards.length; i++){
        // create a card
        var card = cards[i];
        var cardEntity = Crafty.e("Card");
        cardEntity.x = this._x - 200;
        cardEntity.y = this._y + 50;
        cardEntity.setCard(card.number, card.suit);
        this.addCard(cardEntity).animateToHand(cardEntity, 100, i *.25);
      }
    }

});




Crafty.c('Discard', {

    init: function() {
      this.requires('2D, Canvas, 2dHelper, deckImage, Mouse');

      this.numOfCards = 0;
      this.baseZIndex = 100;
    }

    ,reset:function(){
        this.numOfCards = 0;
    }

    ,dropCard:function(card){
        var pos = this.getPositionOfEntityIfCentered(card);
        var x = pos.x + Crafty.math.randomInt(-5, 5);
        var y = pos.y + Crafty.math.randomInt(-5, 5);
        var rot =  + Crafty.math.randomInt(-10, 10);
        this.numOfCards++;
        card.setState("discarded");
        card.disableDrag();
        card.z = this.numOfCards + this.baseZIndex;

        card.addTween({x:x, y:y, rotation:rot}, "easeOutExpo", 50, function(){
            // draw a new card
            Crafty.trigger("DrawNewCards");
        });



    }


});



Crafty.c("Score", {

    init:function(){
      this.requires("2D, DOM, Text");
      Crafty.bind("UpdateScore", this._updateScore.bind(this));
      Crafty.bind("SetScore", this._forceScore.bind(this));

      this.unselectable();
      this.textColor("#ffffff", 1);
      this.textFont({
          size:'20px'
      });
      this.w = 400;
      this.score = 0;
      this._oldScore = 0;
      this.label = "Score: ";
      this._forceScore(0);
    }

    ,_forceScore:function(val){
        this._oldScore = this.score = this._score = val;
        this._writeScore();
    }

    // ref is an entity with "getScore"
    ,_updateScore:function(val){
        this.setScore(val);
    }

    // sets a new score and animates to it
    ,setScore:function(num){
        //this.text(this.label+num);
        this.score = num;
        Crafty.bind("EnterFrame", this._draw.bind(this));
        this._writeScore();
    }

    ,_writeScore:function(){
        this.text(this.label+this._oldScore);
    }

    ,_draw:function(){
       if(this.score > this._oldScore){
           this._oldScore++;
           this.text(this.label+this._oldScore);
       }else{
           Crafty.unbind("EnterFrame", this._draw.bind(this));
       }
    }




});


Crafty.c("GameMenu", {

  init:function(){
    this.requires("Web, fade");
    this.replace('<div class="top"><a href="#" class="btn btn-lg btn-danger pull-right menu">Menu</a><a href="#" class="btn btn-default btn-lg pull-left quit">Forfeit</a></div>');
  }

});



Crafty.c("Web", {

  init:function(){
    this.requires("2D, DOM, HTML");
    this.w = Crafty.stage.elem.clientWidth;
    this.h = Crafty.stage.elem.clientHeight;
    var trigger = function(e){
      if(e.target.className.indexOf('quit') >= 0){
        this.trigger('quit');
      }else if(e.target.className.indexOf('menu') >= 0){
        this.trigger('menu');
      }
    }.bind(this);
    var isTouchSupported = "ontouchend" in document;
    if(isTouchSupported){
      this._element.addEventListener('touchend', trigger);
    }else{
      this._element.addEventListener('click', trigger);
    }


  }

});

