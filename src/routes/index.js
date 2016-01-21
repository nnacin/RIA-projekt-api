const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({
    'welcome': 'This is a pizza api!'
  , 'status': 'OK'
  , 'user': 'GET, POST, PUT'
  , 'pizza': 'GET, POST, PUT, DELETE'
  , 'drink': 'GET, POST, PUT, DELETE'
  , 'order': 'GET, POST'
  , 'employee': 'GET, POST, PUT'
  , 'location': 'GET, POST, PUT, DELETE'
  });
});

module.exports = router;
