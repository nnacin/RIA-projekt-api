const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({
    'welcome': 'This is a pizza api!'
  , 'users': 'GET, POST, PUT'
  , 'pizza': 'GET, POST, PUT'
  , 'drink': 'GET, POST, PUT'
  , 'order': 'GET, POST, PUT'
  });
});

module.exports = router;
