const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Pizza = require('../models/pizzas');
const debug = require('debug')('route:pizza');
const err = require('../modules/errors');

router.get('/pizza', (req, res, next) => {
  let {id} = req.query;
  if (!id) {
    Pizza.find({}, { _id: 1, name: 1, price: 1 }).exec()
    .then(pizzas => {
      return res.json(pizzas);
    })
  } else {
    Pizza.find({ _id: id }, { __v: 0 }).exec()
    .then(pizzas => {
      return res.json(pizzas);
    })
  }
});

router.post('/pizza', (req, res, next) => {
  let {name, price, ingredients} = req.body;
  if (!(name && price && ingredients))
    return res.status(400).json(err(400, 1, 'All fields are required!'));

  if (isNaN(price))
    return res.status(400).json(err(400, 2, 'Price must be a number!'));

  if (!ingredients.length)
    return res.status(400).json(err(400, 3, 'You must provide at least one ingredient!'));

  Pizza.count({ name: name }).exec()
  .then(count => {
    if (count != 0) {
      debug('err', name, 'in use!');
      throw `${name} already exists!`;
    }

    let model = new Pizza({
                name: name
              , price: price
              , ingredients: ingredients
    })
    model.save(e => {
      if (e) throw e;
      return res.json({ 'success': `${name} has been created!` });
    });
  })
  .catch(e => {
    debug('error', e);
    res.status(400).json(err(400, 3, e));
  })

});

router.put('/pizza', (req, res, next) => {
  let {id, name, price, ingredients} = req.body;
  if (!(id && name && price && ingredients))
    return res.status(400).json(err(400, 1, 'All fields are required!'));

  if (id.length !== 24)
    return res.status(400).json(err(400, 2, 'Invalid id!'));

  if (isNaN(price))
    return res.status(400).json(err(400, 3, 'Price must be a number!'));

  if (!ingredients.length)
    return res.status(400).json(err(400, 4, 'You must provide at least one ingredient!'));

  Pizza.update({ _id: id }, { name: name, price: price, ingredients: ingredients }).exec()
  .then(r => {
    return res.json(r);
  });
});
module.exports = router;
