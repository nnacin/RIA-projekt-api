const express = require('express');
const router = express.Router();
const Employee = require('../models/employees');
const debug = require('debug')('route:employee');
const responder = require('../modules/responder');

router.get('/employee', (req, res, next) => {
  let {id} = req.query;
  let query, labels = {}
  if (!id) {
    query = {};
    labels = { _id: 1, name: 1, lastName: 1, username: 1, active: 1 }
  } else {
    query = { _id: id };
    labels = { __v: 0, password: 0 };
  }
  Employee.find(query, labels).exec()
  .then(em => {
    return res.json(em);
  })
});

//register new employee
router.post('/employee', (req, res, next) => {
  let {firstName, lastName, username, email, password, password2} = req.body;
  if (!(firstName && lastName && username && email && password && password2))
    return res.status(400).json(responder(400, 1, 'All fields are required!'));

  if (username.length < 6)
    return res.status(400).json(responder(400, 2, 'Username must be at least 6 characters long!'));

  if (password != password2)
    return res.status(400).json(responder(400, 3, 'Passwords do not match!'));

  if (password.length < 6)
    return res.status(400).json(responder(400, 4, 'Password must be at least 6 characters long!'));

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
  let {id, firstName, lastName, username, email, password, password2} = req.body;
  if (!(id, firstName && lastName && username && email && password && password2))
    return res.status(400).json(responder(400, 1, 'All fields are required!'));

  Employee.update({ _id: id }, {firstName: firstName, lastName: lastName}).exec()
  .then(r => {
    return res.json(responder(200, 0, r));
  });
});

module.exports = router;
