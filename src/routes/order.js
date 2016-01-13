const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/orders');
const debug = require('debug')('route:order');
const err = require('../modules/errors');

router.get('/order', (req, res, next) => {
  res.json({ 'order': 'Place your order here' });
});

router.post('/order', (req, res, next) => {
  let {name, price, ingredients} = req.body;

  let model = new Order ({
  //[WIP]
            status: 'tzu'
  });
  model.save(e => {
    if (e) return res.json({ 'success': `${req.body.username} has been created!` });
    return res.json({ 'success': `${req.body.username} has been created!` });
  })
});

module.exports = router;
