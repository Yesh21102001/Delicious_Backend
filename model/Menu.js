const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  image: { type: String },
  isEnabled: { type: Boolean, default: true },
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  isEnabled: { type: Boolean, default: true },
  items: [menuItemSchema],
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
});

module.exports = mongoose.model("Menu", categorySchema);
