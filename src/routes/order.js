const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/orders');
const User = require('../models/users');
const debug = require('debug')('route:order');
const responder = require('../modules/responder');

router.get('/order', (req, res, next) => {
  let {user, id} = req.query;
  if (!user && !id) {
    Order.find({ status: { $ne: 'completed' } }).exec()
    .then(r => {
      return res.json(responder(200, 0, r));
    })
  } else if (user) {
    Order.find({ user: user }).exec()
    .then(r => {
      return res.json(responder(200, 0, r));
    })
  } else if (id) {
    Order.find({ _id: id }).exec()
    .then(r => {
      return res.json(responder(200, 0, r));
    })
  }
});

router.post('/order', (req, res, next) => {
  let {user, location, items} = req.body;
  if (!(user && items))
    return res.status(400).json(responder(400, 1, 'All fields are required!'));

  if (user.length !== 24)
    return res.status(400).json(err(400, 2, 'Invalid id!'));

  User.count({ _id: user }).exec()
  .then(c => {
    if (c < 1) throw `User ${user} does not exist!`;

    let model = new Order ({
                user: user
              , location: location
              , items: items
              , status: 'preparing'
    });
    model.save(e => {
      if (e) throw e;
      return res.json(responder(200, 0, 'Order has been created!'));
    })
  })
  .catch(e => {
    return res.json(responder(400, 3, e));
  })
});

module.exports = router;
