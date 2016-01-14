const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;


const orderSchema = mongoose.model('Order', {
  user:  	    { type: ObjectId, ref: 'user' }
, location:   {
    address:  String
  , city:     String
  , zipCode:  Number
  }
, items:      [Mixed]
, status:     {
    type:     String
  , validate: {
      validator: (v) => {
        return /preparing|ready|delivering|completed/i.test(v);
      }
  , message: '{VALUE} is not a valid status!'
  }
, dateCreated: { type: Date, default: Date.now }
}
});

export default orderSchema;
