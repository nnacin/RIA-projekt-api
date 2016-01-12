// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
  function(username, password, callback) {
      
    if (username === 'ria' && password === 'pswd') {
    return callback(null, {
      username: 'ria'
    });
  } else {
    return callback(null, false);
  }
  }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false });