

var PoRumBo = {
    suits : ["C", "S", "H", "D"]
    ,numbers : ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    ,bonuses:[100,0,1,0,5,0,1,0,100,0,0,0,0,0,0,0,0,0,1,0,25,0,1,0,25,0,1,0,0,0,0,0,0,0,0,0,5,0,0,0,10,0,0,0,5,0,0,0,0,0,0,0,0,0,1,0,25,0,1,0,25,0,1,0,0,0,0,0,0,0,0,0,100,0,1,0,5,0,1,0,100]

    ,gridSize:9

    ,totalPlays:0

    ,_card_at_pos_n:function(positions, fromIndex){
        var pos = fromIndex - this.gridSize;
        if(pos < 0){
            return null;
        }
        return positions[pos];
    }
    ,_card_at_pos_e:function(positions, fromIndex){
        var pos = fromIndex + 1;
        if(pos % this.gridSize === 0){
            return null;
        }
        return positions[pos];
    }
    ,_card_at_pos_s:function(positions, fromIndex){
        var pos = fromIndex + this.gridSize;
        if(pos >= (this.gridSize * this.gridSize)){
            return null;
        }
        return positions[pos];
    }
    ,_card_at_pos_w:function(positions, fromIndex){
        var pos = fromIndex - 1;
        if(fromIndex % this.gridSize === 0){
            return null;
        }
        return positions[pos];
    }

    // careful could be recursive!
    ,_cards_to_pos_dynamic:function(positions, fromIndex, location){
        var pos = fromIndex;
        var card =  positions[pos];
        var cards = [];
        cards.push(card);
        while(this['_card_at_pos_'+location](positions, pos)){
            card = this['_card_at_pos_'+location](positions, pos);
            cards.push(card);
            pos = card.index;
        }
        return cards;
    }
    ,_card_at_pos_dynamic:function(positions, fromIndex, location){
        var cards = this._cards_to_pos_dynamic(positions, fromIndex, location);
        return cards[cards.length-1];

    }

    ,_card_at_pos_t:function(positions, fromIndex){
        return this._card_at_pos_dynamic(positions, fromIndex, 'n');
    }
    ,_card_at_pos_r:function(positions, fromIndex){
        return this._card_at_pos_dynamic(positions, fromIndex, 'e');
    }
    ,_card_at_pos_b:function(positions, fromIndex){
        return this._card_at_pos_dynamic(positions, fromIndex, 's');
    }
    ,_card_at_pos_l:function(positions, fromIndex){
        return this._card_at_pos_dynamic(positions, fromIndex, 'w');
    }

    ,_isSameColumn:function(cardList){
        var pos = cardList[0].index%this.gridSize;
        for(var i = 1; i < cardList.length; i++){
           if(cardList[i].index%this.gridSize !== pos){
               return false;
           }
        }
        return true;
    }
    ,_isSameRow:function(cardList){
        var pos = parseInt(cardList[0].index/this.gridSize);
        for(var i = 1; i < cardList.length; i++){
            if(parseInt(cardList[i].index/this.gridSize) !== pos){
                return false;
            }
        }
        return true;
    }

    /*
       gets a card starting at location from index
       location = n,e,s,w    t,r,b,l
       returns null if no card
    */
    ,_getCard:function(positions, fromIndex, location){
        return this["_card_at_pos_"+location](positions, fromIndex);
    }
    /*
      gets all the cards in the row or column
      location = t,r,b,l
    */
    ,_getCards:function(positions, fromIndex, location){
        var transform = {t:'n', r:'e', b:'s', l:'w'};
        return this._cards_to_pos_dynamic(positions, fromIndex, transform[location]);
    }

    ,submitPlay:function(gameState){
        var details = {
            isValid: false
            ,points:0
        };
        var points = 0;
        var positions = gameState.positions;
        var currentPlay =  gameState.currentPlay;
        // first make sure cards were even played
        if(currentPlay.length <= 0){
            return details;
        }
        // cards must be same column or row
        var isSameColumn =  this._isSameColumn(currentPlay);
        var isSameRow = this._isSameRow(currentPlay);
        if( !(isSameColumn || isSameRow) ){
            return details;
        }

        var startCard = currentPlay[0];
        var endCard =  currentPlay[currentPlay.length-1];

        var play, direction, plays = [], bonusDir, startDir, i;
        direction =   isSameRow ? 'r' : 'b';

        startDir = {r:"l", b:"t"};
        // bonus directions, based off direction
        bonusDir = {
            r:{
                start:"t"
                ,end:"b"
            }
            ,b:{
                start:"l"
                ,end:"r"
            }
        };

        // get main play
        // could have cards on left from ld play
        // so, take that into account
        var firstCard = this._getCard(positions, startCard.index, startDir[direction]);
        play = this._getCards(positions, firstCard.index, direction);

        // fix for scenario where a single card is placed
        if(play.length === 1){
            direction = 'b';
            firstCard = this._getCard(positions, startCard.index, startDir[direction]);
            play = this._getCards(positions, firstCard.index, direction);
        }

        // make sure the play isn't split up (no gaps)
        if(!this._playHasCard(play, endCard)){
            return details;
        }

        // test all plays by finding and storing them
        plays.push(play);
        // loop each card in play to see if there is another play off it
        for(i = 0; i < play.length; i++){
            if(play[i].state === 'board'){
                // find bonus play
                var startCard = this._getCard(positions, play[i].index, bonusDir[direction].start);
                var bonusPlay = this._getCards(positions, startCard.index, bonusDir[direction].end);
                if(bonusPlay.length > 1){ // a play of 1 is just a card so skip it
                    plays.push(bonusPlay);
                }
            }
        }

        // check each play to make sure it's valid
        for(i = 0; i < plays.length; i++){
            var res = this._examinePlay(plays[i]);
            if(!this._isPlayValidSet(res)){
                return details;
            }
            // calculate points for the play
            points += ( this._calculatePlayPoints(plays[i]) * res.playType ) + this._calculatePlayBonusPoints(plays[i]);
        }
        details.points = points;
        details.isValid = true;
        //console.log(details);
        //console.log(JSON.stringify(gameState));
        return details;
    }

    // detects gaps in the play by looking at last card and play and seeing
    // if it exists in the play
    ,_playHasCard:function(play, card){
        for(var i = 0; i < play.length; i++){
            if(play[i] === card){
                return true;
            }
        }
        return false;
    }
    
    // tests the play to make sure it is a valid play but using other helpers
    ,_isPlayValidSet:function(res){
      //var res = this._examinePlay(play); // for caching results

      // make sure play is connected to a green square
      if(!res.isConnected){
        return false;
      }

      //make sure valid length and has a valid hand
      if(res.hits < 2){
        return false;
      }

      // verify the rank
      if(res.length >= 3 && res.length <= 4 && res.isSameRank){
        return true;
      }
      
      // verify straight flushes
      if(res.isValidLength && res.isFlush && res.isStraight){
        return true;
      }
 
      
      if(res.length == 5 && (res.isStraight || res.isFlush)){
        return true;
      }     
      
      // not a good play
      return false;
    }
    
    // returns an obj with test results
    ,_examinePlay:function(play){
      var tests = ['_isPlayValidLength', '_isPlayStraight', '_isPlaySameRank', '_isPlayFlush', 'isPlayConnected'];
      var testLabels = ['isValidLength', 'isAscStraight', 'isSameRank', 'isFlush', 'isConnected'];
      var out = {}, hits = 0, res;
      for(var i = 0; i < tests.length; i++){
          res = this[tests[i]](play);
          if(res)
            hits++;
          out[testLabels[i]] = res;
      }
      res = this._isPlayStraight(play, -1);
      if(res)
        hits++;
      out['isDecStraight'] = res;
      out['isStraight'] = out['isDecStraight'] || out['isAscStraight'];
      out['hits'] = hits;
      // determine the play type
      var playType = 0;
      if(play.length === 3 && (out.isSameRank || out.isFlush)){
        playType = 1;
      }else if(play.length === 4 && (out.isSameRank || out.isFlush)){
        playType = 2;
      }else if(play.length === 5 && out.isFlush && out.isStraight){
        playType = 3;
      }else if(play.length === 5 && (out.isStraight || out.isFlush)){
        playType = 2;
      }
      out.length = play.length;
      out['playType'] = playType;
      return out;
    }

    ,_debugPlay:function(play){
        //console.log('::: PLAY DEBUG :::');
        //console.log(JSON.stringify(this._examinePlay(play)));
    }

    // returns a numeric value of a card
    // taking into account wilds and the ace
    ,_getCardNumberValue:function(card){
        var val = +card.number;
        if(isNaN(val)){
            if(card.number === "A"){
                return 1;
            }
            return 0;
        }
        return val;
    }

    // point value for scoring
    ,_getCardPointValue:function(card){
        var val = +card.number;
        if(isNaN(val) & card.number !== "A"){
            return 0;
        }
        return 10;
    }
    ,_calculatePlayPoints:function(play){
        var points = 0;
        for(var i = 0; i < play.length; i++){
            points += this._getCardPointValue(play[i]);
        }
        return points;
    }
    ,_calculatePlayBonusPoints:function(play){
        var points = 0;
        for(var i = 0; i < play.length; i++){
            points += this.bonuses[play[i].index];
        }
        return points;
    }

    ,_getIndexOfNextNonWild:function(play){
        for(var i = 0; i < play.length; i++){
            var val = this._getCardNumberValue(play[i]);
            if(val > 0){
               return i;
            }
        }
        return 0;
    }

    ,_isPlayValidLength:function(play){
        return !(play.length < 3 || play.length > 5);
    }

    ,_isPlayStraight:function(play, direction){
        direction = direction || 1; // or -1
        var startIndex = this._getIndexOfNextNonWild(play);
        var val1 = this._getCardNumberValue(play[startIndex]);
        for(var i = startIndex+1; i < play.length; i++){
           var val2 = this._getCardNumberValue(play[i]);
            //  not wild  & not a consecutive value
            var indx = i - startIndex;
            var offsetValue = val1 + (indx*direction);
            // make sure 10's and A's are on the edges
            if(offsetValue < 1 || offsetValue > 10){
                return false;
            }
            if(val2 !== 0 && (offsetValue !== val2)  ){
               return false;
            }
        }
        return true;
    }

    ,isPlayConnected:function(play){
        // is the play on a green spot or connected to a hand on a green spot
        for(var i = 0; i < play.length; i++){
            if(this.bonuses[play[i].index] === 25 || play[i].state === 'played'){
                return true;
            }
        }
        return false;
    }

    ,_isPlaySameRank:function(play){
        var startIndex = this._getIndexOfNextNonWild(play);
        var val1 = this._getCardNumberValue(play[startIndex]);
        for(var i = startIndex+1; i < play.length; i++){
            var val2 = this._getCardNumberValue(play[i]);
            //  not wild  & not a consecutive value
            if(val2 !== 0 && (val1 !== val2) ){
                return false;
            }
        }
        return true;
    }

    ,_isPlayFlush:function(play){
        var startIndex = this._getIndexOfNextNonWild(play);
        for(var i = startIndex+1; i < play.length; i++){
            var val2 = this._getCardNumberValue(play[i]);
            //  not wild  & not a consecutive value
            if(val2 !== 0 && (play[i].suit !== play[startIndex].suit)  ){
                return false;
            }
        }
        return true;
    }

};