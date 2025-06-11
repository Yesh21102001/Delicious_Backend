const Cart = require("../model/Cart");

exports.saveCart = async (req, res) => {
  const { userId, items, deliveryLocation, coupon, estimatedTime, cookingInstructions } = req.body;

  await Cart.findOneAndUpdate(
    { userId },
    { userId, items, deliveryLocation, coupon, estimatedTime, cookingInstructions },
    { upsert: true }
  );

  res.json({ message: "Cart saved" });
};

exports.getCart = async (req, res) => {
  const { userId } = req.params;
  const cart = await Cart.findOne({ userId });
  res.json(cart);
};
