const express = require('express');
const router = express.Router();
const User = require('../models/users');
const utils = require('../modules/utils');
const moment = require('moment');
const debug = require('debug')('route:user');
const responder = require('../modules/responder');
const bcrypt = require('bcrypt');

router.get('/user', (req, res, next) => {
  let {id, username} = req.query;
  if (username) {
    console.log(username);
    User.find({ username: username }, { __v: 0 }).exec()
    .then(em => {
      return res.json(em);
    })
  } else if (!id) {
    return res.status(400).json(responder(400, 1, 'You must provide a user id!'));
  } else  if (id.length !== 24) {
    return res.status(400).json(responder(400, 2, 'Invalid id!'));
  } else {
    User.find({ _id: id }, { __v: 0, password: 0 }).exec()
    .then(em => {
      return res.json(em);
    })
  }
});

router.post('/user', (req, res, next) => {
  let {firstName, lastName, username, email, password, password2, phone, birthday, address, city, zipCode} = req.body;
  if (!(firstName && lastName && username && email && password && password2 && phone && birthday && address && city && zipCode))
    return res.status(400).json(responder(400, 1, 'All fields are required!'));

  if (username.length < 6)
    return res.status(400).json(responder(400, 2, 'Username must be at least 6 characters long!'));

  if (password != password2)
    return res.status(400).json(responder(400, 3, 'Passwords do not match!'));

  if (password.length < 6)
    return res.status(400).json(responder(400, 4, 'Password must be at least 6 characters long!'));

  if (!utils.valBirthday(birthday))
    return res.status(400).json(responder(400, 5, 'Birthday is not a valid date! Must be DD-MM-YYYY!'));

  if (!utils.isNumeric(zipCode))
    return res.status(400).json(responder(400, 6, 'Zip code must be a number!'));

  User.count({ username: username }).exec()
  .then(user => {
    if (user != 0) {
      debug('err', user);
      throw 'Username already in use!';
    }

    debug('Adding new user', username);
    let model = new User({
                firstName:  firstName
              , lastName:   lastName
              , username:   username
              , email:      email
              , password:   createHash(password)
              , phone:      phone
              , birthday:   moment.utc(birthday, 'DD-MM-YYYY')
              , location: {
                    address:  address
                  , city:     city
                  , zipCode:  zipCode
              }
          })
    model.save(e => {
      if (e) throw e;
      return res.json(responder(200, 0, `${username} has been created!`));
    });
  })
  .catch(e => {
    debug('error', e);
    res.status(400).json(responder(400, 7, e));
  })
});

router.put('/user', (req, res, next) => {
  let {id, firstName, lastName, phone, address, city, zipCode, password, password2} = req.body;

  if (id && password && password2) {
    if (id.length !== 24)
      return res.status(400).json(responder(400, 2, 'Invalid id!'));

    if (password != password2)
      return res.status(400).json(responder(400, 3, 'Passwords do not match!'));

    if (password.length < 6)
      return res.status(400).json(responder(400, 4, 'Password must be at least 6 characters long!'));

    User.update({ _id: id }, {password: createHash(password)}).exec()
    .then(r => {
      return res.json(responder(200, 0, r));
    });
  } else {

    if (!(id && firstName && lastName && phone))
      return res.status(400).json(responder(400, 1, 'All fields are required!'));

    if (id.length !== 24)
      return res.status(400).json(responder(400, 2, 'Invalid id!'));

    if (!utils.isNumeric(zipCode))
      return res.status(400).json(responder(400, 3, 'Zip code must be a number!'));

    User.update({ _id: id }, {firstName: firstName
                            , lastName: lastName
                            , phone: phone
                            , location: {
                                address: address
                              , city: city
                              , zipCode: zipCode
                            } }).exec()
    .then(r => {
      return res.json(responder(200, 0, r));
    });
  }
});

const createHash = function (password) {
 return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports = router;
