const express = require('express');
const router = express.Router();
const Promise = require('bluebird');
const utils = require('../modules/utils');
const Location = require('../models/locations');
const debug = require('debug')('route:location');
const responder = require('../modules/responder');

router.get('/location', (req, res, next) => {
  let {id} = req.query;
  let query = {}
  let labels = { __v: 0 };
  if (id)
    query = { _id: id };
  Location.find(query, labels).exec()
  .then(loc => {
    return res.json(loc);
  })
  .catch(e => {
    debug(e);
    if (e.name === 'CastError')
      return res.status(400).json(responder(400, 1, 'Invalid id'));
    else
      return res.status(400).json(responder(400, 1, e));
  })
});

router.post('/location', (req, res, next) => {
  let {name, address, city, zipCode, workHours, phone} = req.body;
  if (!(name && address && city && zipCode && workHours && phone))
    return res.status(400).json(responder(400, 1, 'All fields are required!'));

  if (!utils.isNumeric(zipCode))
    return res.status(400).json(responder(400, 2, 'Zip code must be a number!'));

  let cwh = utils.valWH(workHours);
  if (cwh)
    return res.status(400).json(responder(400, 3, cwh));

  const valAdd = Promise.promisify(utils.validateAddress);
  let validAddress = {};
  valAdd(address, city)
  .then((geo) => {
    if(!geo)
      throw 'Address is invalid!';
    validAddress = geo;
    return Location.count({ name: name }).exec()
  })
  .then(count => {
    debug(validAddress)
    if (count != 0) {
      debug('err', name, 'in use!');
      throw `${name} already exists!`;
    }

    let model = new Location({
                name: name
              , address: validAddress.address
              , city: validAddress.city
              , zipCode: validAddress.zipCode
              , phone: phone
              , coordinates: {
                lat: validAddress.location.lat,
                lng: validAddress.location.lon
                }
              , workHours: workHours
    })
    model.save(e => {
      if (e) throw e;
      return res.json(responder(200, 0, `${name} has been created!`));
    });
  })
  .catch(e => {
    debug('error', e);
    res.status(400).json(responder(400, 4, e));
  })
});

router.put('/location', (req, res, next) => {
  let {id, name, address, city, zipCode, workHours, phone} = req.body;
  if (!(id, name && address && city && zipCode && workHours && phone))
    return res.status(400).json(responder(400, 1, 'All fields are required!'));

  if (!utils.isNumeric(zipCode))
    return res.status(400).json(responder(400, 2, 'Zip code must be a number!'));

  let cwh = utils.valWH(workHours);
  if (cwh)
    return res.status(400).json(responder(400, 3, cwh));

  const valAdd = Promise.promisify(utils.validateAddress);
  let validAddress = {};
  valAdd(address, city)
  .then((geo) => {
    if(!geo)
      throw 'Address is invalid!';
    validAddress = geo;

    Location.update({ _id: id }, {  name: name
                                  , address: validAddress.address
                                  , city: validAddress.city
                                  , zipCode: validAddress.zipCode
                                  , workHours: workHours
                                  , phone: phone
                                  , coordinates: {
                                      lat: validAddress.location.lat,
                                      lng: validAddress.location.lon
                                  }})
    .exec()
    .then(r => {
      return res.json(r);
    });
  })
  .catch(e => {
    debug('error', e);
    res.status(400).json(responder(400, 4, e));
  })
});

router.delete('/location', (req, res, next) => {
  let {id} = req.body;
  if (!id)
    return res.status(400).json(responder(400, 1, 'You must provide an id!'));

  if (id.length !== 24)
    return res.status(400).json(responder(400, 2, 'Invalid id!'));

  Location.remove({ _id: id }).exec()
  .then(r => {
    return res.json(responder(200, 0, r));
  });
});

module.exports = router;
