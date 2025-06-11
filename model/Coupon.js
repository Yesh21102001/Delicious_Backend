// model/Coupon.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  discountAmount: { type: Number, required: true },
  minOrderAmount: { type: Number, required: true },
  expiryDate: { type: Date, required: true }
});

module.exports = mongoose.model("Coupon", couponSchema);