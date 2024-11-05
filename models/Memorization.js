const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memorizationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  memorizedAmount: {
    type: Number,
    required: true,
    min: 0,
    max: 30,
    validate: {
      validator: function (v) {
        return v >= 0 && v <= 30;
      },
      message: props => `${props.value} is not between 0 and 30!`
    }
  },
  amountPerDay: {
    type: Number, 
    required: true
  },
  daysPerWeek:{
    type:[Number],
    required:[true,'days in week must be provided'],
    validate: {
      validator: function (days) {
        return days.every(day => day >= 0 && day <= 6);
      },
      message: 'daysPerWeek must contain values between 0 and 6.'
    },
  }
 ,
  
}, {
  timestamps: true
});

module.exports = mongoose.model("Memorization", memorizationSchema);
