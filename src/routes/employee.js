const express = require('express');
const router = express.Router();
const Employee = require('../models/employees');
const debug = require('debug')('route:employee');
const responder = require('../modules/responder');

router.get('/employee', (req, res, next) => {
  let {id, username} = req.query;
  let query, labels = {}
  if (id) {
    query = { _id: id };
    labels = { __v: 0, password: 0 };
  } else if (username) {
    query = { username: username };
    labels = { __v: 0 };
  } else 
    labels = { _id: 1, name: 1, lastName: 1, username: 1, active: 1 }
  Employee.find(query, labels).sort({ active: 'desc' }).populate('location').exec()
  .then(em => {
    return res.json(em);
  })
  .catch(e => {
    debug(e);
    if (e.name === 'CastError')
      return res.status(400).json(responder(400, 1, 'Invalid id'));
    else
      return res.status(400).json(responder(400, 2, e));
  })
});

router.post('/employee', (req, res, next) => {
  let {firstName, lastName, username, email, password, password2, location} = req.body;
  if (!(firstName && lastName && username && email && password && password2 && location))
    return res.status(400).json(responder(400, 1, 'All fields are required!'));

  if (username.length < 6)
    return res.status(400).json(responder(400, 2, 'Username must be at least 6 characters long!'));

  if (password != password2)
    return res.status(400).json(responder(400, 3, 'Passwords do not match!'));

  if (password.length < 6)
    return res.status(400).json(responder(400, 4, 'Password must be at least 6 characters long!'));

  if (location.length !== 24)
    return res.status(400).json(responder(400, 2, 'Invalid location!'));

  Employee.count({ username: username }).exec()
  .then(user => {
    if (user !== 0) {
      throw 'Username already in use!';
    }

    debug(`Adding new employee ${username}`);
    let model = new Employee({
                firstName:  firstName
              , lastName:   lastName
              , username:   username
              , email:      email
              , password:   password
              , location:   location
          })
    model.save(e => {
      if (e) throw e;
      return res.json(responder(200, 0, `${username} has been created!`));
    });
  })
  .catch(e => {
    debug('error', e);
    res.status(400).json(responder(400, 5, e));
  })
});

router.put('/employee', (req, res, next) => {
  let {id, firstName, lastName, email, location, active, admin} = req.body;
  if (!(id && firstName && lastName && email && location && active && admin))
    return res.status(400).json(responder(400, 1, 'All fields are required!'));

  if (id.length !== 24)
    return res.status(400).json(responder(400, 2, 'Invalid id!'));

  if (location.length !== 24)
    return res.status(400).json(responder(400, 2, 'Invalid location id!'));

  Employee.update({ _id: id }, {firstName: firstName, lastName: lastName, email: email, location: location, active: active, admin: admin}).exec()
  .then(r => {
    return res.json(responder(200, 0, r));
  });
});

module.exports = router;
