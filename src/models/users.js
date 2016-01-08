const mongoose = require('mongoose');

const userSchema = mongoose.model('User', {
  firstName:  String
, lastName:   String
, username:   String
, email:      String
, password:   String
, birthday:   Date
, dateJoined: { type: Date, default: Date.now }
});

export default userSchema;
