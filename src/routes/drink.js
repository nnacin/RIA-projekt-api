const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Drink = require('../models/drinks');
const debug = require('debug')('route:drink');
const err = require('../modules/errors');

router.get('/drink', (req, res, next) => {
  let {id} = req.query;
  if (!id) {
    Drink.find({}).exec()
    .then(drinks => {
      return res.json(drinks);
    })
  } else {
    Drink.find({ _id: id }, { __v: 0 }).exec()
    .then(drinks => {
      return res.json(drinks);
    })
  }
});

router.post('/drink', (req, res, next) => {
  let {name, price, quantity} = req.body;
  if (!(name && price && quantity))
    return res.status(400).json(err(400, 1, 'All fields are required!'));

  if (isNaN(price))
    return res.status(400).json(err(400, 2, 'Price must be a number!'));

  if (isNaN(quantity))
    return res.status(400).json(err(400, 3, 'Quantity must be a number!'));

  Drink.count({ name: name, quantity: quantity }).exec()
  .then(count => {
    if (count != 0) {
      debug('err', name, quantity, 'in use!');
      throw `${name} (${quantity}l) already exists!`;
    }

    let model = new Drink({
                name: name
              , price: price
              , quantity: quantity
    })
    model.save(e => {
      if (e) throw e;
      return res.json({ 'success': `${name} (${quantity}l) has been created!` });
    });
  })
  .catch(e => {
    debug('error', e);
    res.status(400).json(err(400, 3, e));
  })

});

router.put('/drink', (req, res, next) => {
  let {id, name, price, quantity} = req.body;
  if (!(id && name && price && quantity))
    return res.status(400).json(err(400, 1, 'All fields are required!'));

  if (id.length !== 24)
    return res.status(400).json(err(400, 2, 'Invalid id!'));

  if (isNaN(price))
    return res.status(400).json(err(400, 3, 'Price must be a number!'));

  if (isNaN(quantity))
    return res.status(400).json(err(400, 4, 'Quantity must be a number!'));

  Drink.update({ _id: id }, { name: name, price: price, quantity: quantity }).exec()
  .then(r => {
    return res.json(r);
  });
});
module.exports = router;
