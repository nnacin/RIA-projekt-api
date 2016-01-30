const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routeLoader = require('express4-route-loader');
const debug = require('debug')('app');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const config = require('../config.json');
const initAdmin = require('./modules/initAdmin')
const auth = require('./modules/auth');
const passport = require('passport');
const responder = require('./modules/responder');

const app = express();

app.enable('trust proxy');

//init db
mongoose.connect(config.mongo);
mongoose.Promise = Promise;

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport init
app.use(passport.initialize());
app.all('*', auth.isAuthenticated, (req, res, next) => { next() });

//init admin account
initAdmin();

//load all routes from ./routes
routeLoader(app, __dirname + '/routes');

// catch 404 and forward to error handler
app.use((req, res, next) => {
    return res.status(404).json(responder(404));
});

if (app.get('env') === 'development')
  app.use((err, req, res, next) => {
    return res.status(500).json(responder(500, 0, `${err}`));
});

module.exports = app;
