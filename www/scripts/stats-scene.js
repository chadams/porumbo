Crafty.scene("stats", function(){

  var web, storage, stats;

  storage = $.jStorage;
  stats = GameStatistics(storage).getStats();

  var html = (function () {/*
   <div class="container score">
      <div class="row">
        <div class="col-12">
          <a href="#" class="btn btn-lg btn-danger pull-right menu">Menu</a>
        </div>
      </div>
      <div class="row logo">
        <div class="col-12">
          <img src="assets/splash/logo.png" alt=""/>
        </div>
      </div>
     <div class="row logo">
        <div class="col-12">
          <h1>Statistics</h1>
        </div>
     </div>
      <div class="row">
        <div class="col-12">
        <table class="table table-condensed table-bordered summary">
          <thead>
            <tr>
              <th class="col-4">Plays</th>
              <th class="col-4">Wins</th>
              <th class="col-4">Loses</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{plays}}</td>
              <td>{{wins}}</td>
              <td>{{loses}}</td>
              </tr>
          </tbody>
        </table>
        </div>
      </div>

      <div class="row logo">
        <div class="col-12">
        <h1>Top 10</h1>
        <table class="table table-condensed table-bordered summary">
          <thead>
            <tr>
              <th class="col-4">Score</th>
              <th class="col-4">Cards Left</th>
              <th class="col-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {{top10}}
          </tbody>
        </table>
        </div>
      </div>
   </div>
   */}).toString().match(/[^]*\/\*([^]*)\*\/\;*}$/)[1];

  // build dynamic stats
  var partial = "";
  for(var i = 0; i < stats.top10.length; i++){
    var row = stats.top10[i];
    var d = new Date(row.date);
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var dateStr = curr_date + "-" + curr_month + "-" + curr_year;
    var str = '<tr><td>'+row.score+'</td><td>'+row.cardsLeft+'</td><td>'+dateStr+'</td></tr>';
    partial += str;
  }

  html = html.replace(/{{plays}}/gi, stats.plays);
  html = html.replace(/{{loses}}/gi, stats.loses);
  html = html.replace(/{{wins}}/gi, stats.wins);

  html = html.replace(/{{top10}}/gi, partial);

  web = Crafty.e("Web").replace(html);
  web.bind('menu', function(e){
    Crafty.scene("menu");
  });


});