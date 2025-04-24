const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  isOnline: { type: Boolean, default: true }, // restaurant status
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
