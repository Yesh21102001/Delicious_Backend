const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  userId: String,
  address1: String,
  address2: String,
  city: String,
  postalCode: String,
  latitude: Number,
  longitude: Number,
});

module.exports = mongoose.model("Location", locationSchema);
