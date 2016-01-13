const mongoose = require('mongoose');

const pizzaSchema = mongoose.model('Pizza', {
  name:  	        String
, price:  	      Number
, ingredients:    [String]
, dateAdded:      { type: Date, default: Date.now }
});

export default pizzaSchema;
