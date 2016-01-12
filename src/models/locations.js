const mongoose = require('mongoose');

const locationSchema = mongoose.model('Location', {
  name:  	    String
, address:    String
, zipCode:    Number
, dateOpened: { type: Date, default: Date.now }
, workHours:  {
    monday:     {
      open:     { type: Number, min: 0000, max: 2400 },
      close:    { type: Number, min: 0000, max: 2400 }
    }
  , tuesday:    {
      open:     { type: Number, min: 0000, max: 2400 },
      close:    { type: Number, min: 0000, max: 2400 }
    }
  , wednesday:  {
      open:     { type: Number, min: 0000, max: 2400 },
      close:    { type: Number, min: 0000, max: 2400 }
    }
  , thursday:   {
      open:     { type: Number, min: 0000, max: 2400 },
      close:    { type: Number, min: 0000, max: 2400 }
    }
  , friday:     {
      open:     { type: Number, min: 0000, max: 2400 },
      close:    { type: Number, min: 0000, max: 2400 }
    }
  , saturday:   {
      open:     { type: Number, min: 0000, max: 2400 },
      close:    { type: Number, min: 0000, max: 2400 }
    }
  , sunday:     {
      open:     { type: Number, min: 0000, max: 2400 },
      close:    { type: Number, min: 0000, max: 2400 }
    }
}
});

export default locationSchema;
