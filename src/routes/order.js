const express = require('express');
const router = express.Router();
const moment = require('moment');
const utils = require('../modules/utils');
const Order = require('../models/orders');
const User = require('../models/users');
const debug = require('debug')('route:order');
const responder = require('../modules/responder');

router.get('/order', (req, res, next) => {
  let {user, id} = req.query;
  let query = {};
  if (!user && !id) {
    query = {};
  } else if (user)
    query = { user: user };
  else if (id)
    query = { _id: id };
  Order.find(query).sort({dateCreated: 'desc'}).populate('user').populate('location').exec()
  .then(r => {
    return res.json(r);
  })
  .catch(e => {
    debug(e);
    if (e.name === 'CastError')
      return res.status(400).json(responder(400, 1, 'Invalid id'));
    else
      return res.status(400).json(responder(400, 1, e));
  })
});

router.post('/order', (req, res, next) => {
  let {user, location, deliveryLocation, items, total, dateFinished} = req.body;
  if (!(user && items && location && total && dateFinished))
    return res.status(400).json(responder(400, 1, 'All fields are required!'));

  if (user.length !== 24)
    return res.status(400).json(responder(400, 2, 'Invalid id!'));

  if (!utils.valTime(dateFinished))
    return res.status(400).json(responder(400, 3, 'Invalid dateFinished!'));

  if (deliveryLocation)
    if (!utils.isNumeric(deliveryLocation.zipCode))
      return res.status(400).json(responder(400, 4, 'Zip code must be a number!'));

  User.count({ _id: user }).exec()
  .then(c => {
    if (c < 1) throw `User ${user} does not exist!`;

    let model = new Order ({
                user: user
              , location: location
              , deliveryLocation: deliveryLocation
              , items: items
              , total: total
              , dateFinished: moment(dateFinished, "HH:mm", true)
    });
    model.save(e => {
      if (e) throw e;
      return res.json(responder(200, 0, 'Order has been created!'));
    })
  })
  .catch(e => {
    return res.json(responder(400, 5, e));
  })
});

module.exports = router;
