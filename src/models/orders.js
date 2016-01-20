const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

const orderSchema = mongoose.model('Order', {
  user:  	    { type: ObjectId, ref: 'user' }
, location:   { type: ObjectId, ref: 'location' }
, deliveryLocation:   {
    address:  String
  , city:     String
  , zipCode:  Number
  }
, items:        [Mixed]
, total:        Number
, dateCreated:  { type: Date, default: Date.now }
, dateFinished: { type: Date }
});

export default orderSchema;
