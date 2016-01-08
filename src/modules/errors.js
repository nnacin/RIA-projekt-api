const debug = require('debug')('error');

function err (code, num, info) {
  return {
      "error": "Bad request"
    , "code": code
    , "errorNumber": num
    , "info": info
  }
}

module.exports = err;
