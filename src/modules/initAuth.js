const express = require('express');
const mongoose = require('mongoose');
const Auth = require('../models/auth');
const debug = require('debug')('initAuth');

module.exports.initAuth = function initAuth () {
  Auth.count().exec()
  .then(count => {
    if (count != 1) return reinitAuth();
    return debug('Key found! Using existing key for authentication!');
  })
}

function reinitAuth () {
  Auth.remove().exec()
  .then(r => {
    let pass = "superSecretPassword";
    let model = new Auth({
                key: pass
          })
    model.save(e => {
      if (e) throw e;
      debug('New authentication key generated:', pass);
    })
  })
}
