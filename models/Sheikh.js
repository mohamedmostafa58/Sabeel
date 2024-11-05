const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Schema = mongoose.Schema;

const sheikhSchema = new Schema({
  username: {
    type: String,
    required: [true,'username should be written'],
  },
  phone: {
    type: String,
    required: true,
    unique: [true,'mobile phone should be written'],
    validate: {
      validator: function (v) {
        // Regular expression to validate phone numbers (basic)
        return /^01\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
  dob: {
    type: Date,
    required: true,
    get: function(value) {
      if (!value) return value;
      return value.toISOString().split('T')[0]; 
    },
    set: function(value) {
      return new Date(value);
    }
  },
  gender:{
    type:String,
    required:[true,'you must provide your gender'],
    enum:['M','F'],
  }
}, {
  timestamps: true, 
  toJSON: { getters: true }, 
  toObject: { getters: true }, 
});

sheikhSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("Sheikh", sheikhSchema);
