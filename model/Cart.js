const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [{
    name: String,
    image: String,
    cost: Number,
    quantity: Number,
    cookingRequests: String
  }],
  deliveryLocation: String,
  coupon: String,
  estimatedTime: String,
  cookingInstructions: String
});

module.exports = mongoose.model("Cart", cartSchema);
