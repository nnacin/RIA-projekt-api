const mongoose = require('mongoose');

const orderSchema = mongoose.model('Order', { //[WIP]
  user:  	    String
, location:   String
, status:     {
    type:     String
  , validate: {
      validator: (v) => {
        return /preparing|delivering|completed/i.test(v);
      }
  , message: '{VALUE} is not a valid status!'
  }
, dateCreated: { type: Date, default: Date.now }
}
});

export default orderSchema;
