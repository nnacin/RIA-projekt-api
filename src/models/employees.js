const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const employeeSchema = mongoose.model('Employee', {
  firstName:  String
, lastName:   String
, username:   String
, email:      String
, password:   String
, location:   { type: ObjectId, ref: 'Location' }
, dateJoined: { type: Date, default: Date.now }
, active: 	  { type: Boolean, default: true }
, admin:      { type: Boolean, default: false }
});

export default employeeSchema;
