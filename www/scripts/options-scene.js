Crafty.scene("options", function(){

  var web, storage, stats;

  storage = $.jStorage;
  stats = GameStatistics(storage);

  var html = (function () {/*
   <div class="container score">
      <div class="row">
        <div class="col-12">
          <a href="#" class="btn btn-lg btn-danger pull-right menu">Menu</a>
        </div>
      </div>
     <div class="row">
        <div class="col-12 credits">
          <h1>Options</h1>
        </div>
     </div>
      <div class="row">
        <div class="col-12 opt-buttons">
          <a href="#" class="btn btn-lg btn-danger quit">Clear Statistics</a>
        </div>
      </div>

      <div style="margin-top:100px;" class="row">
        <div class="col-12 credits">
          <h1>Credits</h1>
        </div>
      </div>
      <div class="row">
        <div style="margin-top:20px;" class="col-12 credits">
          <h3>Game Design</h3>
          <p>Paul D Miller</p>
          <h3>Lead Programmer</h3>
          <p>Chad Adams</p>
          <h3>Design & Development</h3>
          <p>Kelly Adams</p>
          <h3>Programmer</h3>
          <p>Lamanh Nguyen</p>

        </div>
        <div style="margin-top:20px;" class="col-12 credits">
          <p>© 2008 X Plus Products, Inc.</p>
        </div>
      </div>

   </div>
   */}).toString().match(/[^]*\/\*([^]*)\*\/\;*}$/)[1];



  web = Crafty.e("Web").replace(html);
  web.bind('menu', function(e){
    Crafty.scene("menu");
  });
  web.bind('quit', function(e){
    stats.clear().save();
    Crafty.scene("stats");
  });

});