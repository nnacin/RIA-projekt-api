const mongoose = require('mongoose');

const authSchema = mongoose.model('Auth', {
  key:  	       String
, dateCreated:   { type: Date, default: Date.now }
});

export default authSchema;
