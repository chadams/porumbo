/**
 *
 * Desc:
 * User: chad
 * Date: 8/9/13 6:48 PM
 */  

var GameStatistics = function(storage){

  var key = 'stats';

  var obj = {
    setStorage:function(storage){
      this.storage = storage;
      return this;
    }
    ,save:function(){
      this.storage.set(key, this._stats);
      return this;
    }
    ,clear:function(){
      this._clear();
      return this;
    }
    ,_clear:function(){
      this._stats = {
        top10:[]
        ,plays:0
        ,wins:0
        ,loses:0
      };
    }
    ,_build:function(){
      this._stats = storage.get(key);
      if(!this._stats){
        this._clear();
      }
    }
    ,addPlay:function(score, cardsLeft){
      var record = {
        score:score
        ,cardsLeft:cardsLeft
        ,date:new Date().getTime()
      };
      this._stats.top10.push(record);
      this._organizeTop10();
      this._stats.plays++;
      if(cardsLeft <= 0){
        this._stats.wins++;
      }
      this._stats.loses = this._stats.plays - this._stats.wins;
      return this;
    }
    ,getStats:function(){
      return this._stats;
    }
    ,_organizeTop10:function(){
      var top = this._stats.top10;
      this._stats.top10.sort(function(a,b){
        if(a.score < b.score){
          return 1;
        }else if(a.score > b.score){
          return -1;
        }
        return 0;
      });
      this._stats.top10 = top.slice(0, 10);
    }

  };

  obj.setStorage(storage);
  obj._build();
  return obj;

};