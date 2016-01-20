const express = require('express');
const router = express.Router();
const Pizza = require('../models/pizzas');
const debug = require('debug')('route:pizza');
const responder = require('../modules/responder');

router.get('/pizza', (req, res, next) => {
  let {id} = req.query;
  let query = {};
  let labels = { __v: 0 };;
  if (id)
    query = { _id: id };
  Pizza.find(query, labels).exec()
  .then(pizzas => {
    return res.json(pizzas);
  })
  .catch(e => {
    debug(e);
    if (e.name === 'CastError')
      return res.status(400).json(responder(400, 1, 'Invalid id'));
    else
      return res.status(400).json(responder(400, 2, e));
  })
});

router.post('/pizza', (req, res, next) => {
  let {name, price, ingredients} = req.body;
  if (!(name && price && ingredients))
    return res.status(400).json(responder(400, 1, 'All fields are required!'));

  if (isNaN(price))
    return res.status(400).json(responder(400, 2, 'Price must be a number!'));

  if (!ingredients.length)
    return res.status(400).json(responder(400, 3, 'You must provide at least one ingredient!'));

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
      return res.json(responder(200, 0, `${name} has been created!`));
    });
  })
  .catch(e => {
    debug('error', e);
    res.status(400).json(responder(400, 3, e));
  })

});

router.put('/pizza', (req, res, next) => {
  let {id, name, price, ingredients} = req.body;
  if (!(id && name && price && ingredients))
    return res.status(400).json(responder(400, 1, 'All fields are required!'));

  if (id.length !== 24)
    return res.status(400).json(responder(400, 2, 'Invalid id!'));

  if (isNaN(price))
    return res.status(400).json(responder(400, 3, 'Price must be a number!'));

  if (!ingredients.length)
    return res.status(400).json(responder(400, 4, 'You must provide at least one ingredient!'));

  Pizza.update({ _id: id }, { name: name, price: price, ingredients: ingredients }).exec()
  .then(r => {
    return res.json(r);
  });
});

router.delete('/pizza', (req, res, next) => {
  let {id} = req.body;
  if (!id)
    return res.status(400).json(responder(400, 1, 'You must provide an id!'));

  if (id.length !== 24)
    return res.status(400).json(responder(400, 2, 'Invalid id!'));

  Pizza.remove({ _id: id }).exec()
  .then(r => {
    return res.json(responder(200, 0, r));
  });
});

module.exports = router;
