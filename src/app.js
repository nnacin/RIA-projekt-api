const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const readdir = require('recursive-readdir');
const routeLoader = require('express4-route-loader');
const debug = require('debug')('app');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const config = require('../config.json');
const initAuth = require('./modules/initAuth');
const auth = require('./modules/auth2');
const passport = require('passport');

const app = express();

app.enable('trust proxy');


// Use the passport package in our application
app.use(passport.initialize());

//init db
mongoose.connect(config.mongo);
mongoose.Promise = Promise;

//get or create auth key
//initAuth.initAuth();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//authentication route
//app.use('*', auth);

// Use the passport package in our application
app.use(passport.initialize());

//TO-DO
//load all routes from ./routes
// AKO OVU LINIJU DOLE OTKOMENTIRAMO ONDA PROLAZI I BEZ AUTORIZACIJE
//routeLoader(app, __dirname + '/routes');

//u vecini primjera u ovoj liniji dole, imaju aplikacije posebni fajl koji se zove routeLoader koji pretpostavljam da radi sta i ovaj gore.. znaci
//po meni mi ovaj routeLoader trebali nekako ugurat kao treci argument u ovu dole liniju (app.use itd)
//zasad ostavimo tako.. pa cemo svaku rutu posebno
app.use('/users', auth.isAuthenticated, require('./routes/index'));
app.use('/user', auth.isAuthenticated, require('./routes/users'));
app.use('/order', auth.isAuthenticated, require('./routes/order'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
