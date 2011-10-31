
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  ;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('modules path', __dirname + '/modules');
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Db

app.db = mongoose;

// Modularization

var modules = require('../index.js')(app);

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
