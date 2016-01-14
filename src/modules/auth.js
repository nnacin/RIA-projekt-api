const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const creds = require('../../creds');
const debug = require('debug')('auth');

passport.use(new BasicStrategy(
  function(username, password, callback) {
    debug('checking');
    if (username === creds.username && password === creds.password) {
      return callback(null, {
        username: 'ria'
      });
    } else {
      debug('fail auth');
      return callback(null, false);
    }
  }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false });
