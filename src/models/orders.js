const mongoose = require('mongoose');

const pizzaSchema = mongoose.model('Pizza', {
  name:  	        String
, price:  	      Number
, ingridents:     [String]
, dateAdded:      Date
});

export default pizzaSchema;
