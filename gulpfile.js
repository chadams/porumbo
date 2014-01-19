var gulp = require('gulp');
var gutil = require('gulp-util');
var http = require('http');
var ecstatic = require('ecstatic');

var port = 8080;

gulp.task('default', function(){
  http.createServer(
  	ecstatic({
  		root:__dirname + '/www'
  	})
  )
  .listen(port);
  console.log('Listening on :'+port);
});