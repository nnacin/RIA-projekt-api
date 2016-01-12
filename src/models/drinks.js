const mongoose = require('mongoose');

const drinkSchema = mongoose.model('Drink', {
  name:  	  String
, price:  	Number
, quantity: Number
});

export default drinkSchema;
