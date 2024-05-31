const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  ip_address: {
    type: String,
    required: true,
  },
  mac_address: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  job_title: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  company_name: {
    type: String,
    required: true,
  },
},{ _id: false });

const User = mongoose.model("User", userSchema);

module.exports = User;
