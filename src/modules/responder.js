const debug = require("debug")("responder");

function respond (code, num, info) {
  switch (code) {
    case 200:
      return {
          "status": "OK"
        , "code": code
        , "info": info
      }
    case 400:
      return {
          "error": "Bad request"
        , "code": code
        , "errorNumber": num
        , "info": info
      }
    case 401:
      return {
          "error": "Unauthorized"
        , "code": code
        , "info": info || "You don't have necessary credentials!"
      }
    case 403:
      return {
          "error": "Forbidden"
        , "code": code
        , "info": info || "You don't have necessary permissions for the resource!"
      }
    case 404:
      return {
          "error": "Not Found"
        , "code": code
        , "info": info || "Requested page does not exist!"
      }
    default:
      return {
          "code": code
        , "info": info
      }
  }
}

module.exports = respond;
