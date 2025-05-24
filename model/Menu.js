const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  itemCost: { type: Number, required: true },
  image: { type: String },
  isEnabled: { type: Boolean, default: true },
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  isEnabled: { type: Boolean, default: true },
  items: [menuItemSchema],
});

module.exports = mongoose.model("Menu", categorySchema);
