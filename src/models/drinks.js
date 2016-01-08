const mongoose = require('mongoose');

const drinkSchema = mongoose.model('Drink', {
  name:  	  String
, price:  	Number
});

export default drinkSchema;
