const mongoose = require('mongoose');

const locationSchema = mongoose.model('Location', {
  name:  	    String
, address:    String
, city:       String
, zipCode:    Number
, phone:      String
, dateOpened: { type: Date, default: Date.now }
, coordinates:{
    lat: Number
  , lng: Number
}
, workHours:  {
    monday:     {
      open:     String,
      close:    String
    }
  , tuesday:    {
      open:     String,
      close:    String
    }
  , wednesday:  {
      open:     String,
      close:    String
    }
  , thursday:   {
      open:     String,
      close:    String
    }
  , friday:     {
      open:     String,
      close:    String
    }
  , saturday:   {
      open:     String,
      close:    String
    }
  , sunday:     {
      open:     String,
      close:    String
    }
}
});

export default locationSchema;
