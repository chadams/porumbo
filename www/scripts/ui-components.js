// UI specific components

Crafty.c('uiPosition', {
  init: function() {
    this.requires('2D')

  }

  ,center:function(colPos, maxCols){
    colPos = colPos || 1;
    maxCols = maxCols || 1;

    var width = Crafty.stage.elem.clientWidth / maxCols;
    var newX = (width/2)-(this._w/2);
    newX = newX + (width * (colPos-1));
    this.x = newX;
    return this;
  }


  ,bottom:function(){
    return this._y + this._h;
  }

});



Crafty.c('uiButton', {
  init: function() {
    this.requires('Mouse');
  }

  ,makeButton:function(action, data){
    this.buttonData = data;
    this.buttonAction = action;
    this.bind("Click", this._onClick.bind(this));
    this.bind("MouseDown", this._onDown.bind(this));
    this.bind("MouseOut", this._onOut.bind(this));
  }

  ,_onClick:function(e){
    this._onOut();
    Crafty.trigger(this.buttonAction, {data:this.buttonData, entity:this});
  }

  ,_onDown:function(e){
    this.alpha = .5;
  }

  ,_onOut:function(e){
    this.alpha = 1;
  }


});