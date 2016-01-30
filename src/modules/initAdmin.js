const bcrypt = require('bcrypt');
const Employee = require('../models/employees');
const debug = require('debug')('route:initAdmin');

function initAdmin () {
  Employee.findOne({ admin: true }).exec()
  .then(admin => {
    if (!admin) return createAdmin();
    return debug('Using existing admin account!')
  })
}

function createAdmin () {
  let model = new Employee({
              firstName:  'Administrator'
            , username:   'admin'
            , password:   createHash('admin')
            , admin:      true
        })
  model.save(e => {
    if (e) throw e;
    debug('Default admin account created!')
  });
}

const createHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

module.exports = initAdmin;
