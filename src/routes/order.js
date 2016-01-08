const express = require('express');
const router = express.Router();

//GET home page.
router.get('/order', (req, res, next) => {
  res.json({ 	'order': 'Place your order here' });
});

module.exports = router;
