const express = require('express');
const router = express.Router();
const config = require('../../config');
const Auth = require('../models/auth');
const debug = require('debug')('auth');

router.all('*', (req, res, next) => {
  if (!config.auth) return next();
  debug('Validating connection');

  let key = req.body.key || req.query.key;
  if (!key)
    return res.status(401).json({ 	'error': 'Unauthorized!' });
  debug(key);
  Auth.findOne().exec()
  .then(k => {
    if (!k) throw key;
    if (k.key != key) return res.status(403).json({ 	'error': 'Forbidden!' });
    return next();
  })


});

module.exports = router;
