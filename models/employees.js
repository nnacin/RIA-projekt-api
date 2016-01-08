const mongoose = require('mongoose');

const employeeSchema = mongoose.model('Employee', {
  firstName:  String
, lastName:   String
, username:   String
, email:      String
, password:   String
, dateJoined: { type: Date, default: Date.now }
, active: 	  Boolean
});

export default employeeSchema;
