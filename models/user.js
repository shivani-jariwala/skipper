//mongoDB Schema
const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    bankName: {
    type: String,
    required: true,
  },
  borrowerName: {
    type: String,
    required: true,
  },
  principal: {
    type: Number,
    required: true,
  },
  years: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  interest: {
    type: Number,
  },
  amount: {
    type: Number,
  },
  interestPerMonth: {
    type: Number,
  },
  lumpsum:{
    type:Number
  },
  emi_lumpsum:{
    type:Number
  },
  totalAmountPaid:{
    type:Number
  },
  
});


module.exports = mongoose.model('user', UserSchema);