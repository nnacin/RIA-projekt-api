const mongoose = require('mongoose');

const userSchema = mongoose.model('User', {
  firstName:  String
, lastName:   String
, username:   String
, email:      String
, password:   String
, birthday:   Date
, location:   {
    address:  String
  , city:     String
  , zipCode:  Number
}
, dateJoined: { type: Date, default: Date.now }
});

export default userSchema;
