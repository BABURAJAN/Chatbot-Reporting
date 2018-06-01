// import all libraries
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var mongoose = require('mongoose'); // mongoose for mongodb
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('ejs-locals')
var expressSession = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');

//configuring application timezione
process.env.TZ = 'utc';

// import all custom modules
config = require('./config');
require('./passport/pass')(passport);

//database connection here
//using mongoose database connectivity
var db = mongoose.connect(config.mongodbUri, function (err, db) {
    if (err) {
        console.log("database connection error ", err);
        throw err;
    } else {
        console.log("Database connected");
    }
});

// Create a new express application and configure it
var app = express();

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(expressSession({secret: 'mySecretKey', cookie: { maxAge: 7200000 }})); // 2Hrs Session
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routing
require('./routes/index')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
   });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;
