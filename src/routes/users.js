const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');
const debug = require('debug')('route:user');
const err = require('../modules/errors');

// GET users listing
router.get('/users', (req, res, next) => {
  res.json({ 'user': 'This is a user page!' });
});

//register new user
router.post('/users', (req, res, next) => {
  let {firstName, lastName, username, email, password, password2, birthday} = req.body;
  if (!(firstName && lastName && username && email && password && password2 && birthday))
    return res.status(400).json(err(400, 1, 'All fields are required!'));

  if (username.length < 6)
    return res.status(400).json(err(400, 2, 'Username must be at least 6 characters long!'));

  if (password != password2)
    return res.status(400).json(err(400, 3, 'Passwords do not match!'));

  if (password.length < 6)
    return res.status(400).json(err(400, 4, 'Password must be at least 6 characters long!'));

  if (isNaN(Date.parse(birthday)))
    return res.status(400).json(err(400, 5, 'Birthday is not a valid date! Must be YYYY-MM-DD!'));

  User.count({ username: username }).exec()
  .then( user => {
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
              , password:   password
              , birthday:   new Date(birthday)
          })
    model.save(e => {
      if (e) throw e;
      return res.json({ 'success': `${req.body.username} has been created!` });
    });
  })
  .catch(e => {
    debug('error', e);
    res.status(400).json(err(400, 6, e));
  })
});

module.exports = router;
