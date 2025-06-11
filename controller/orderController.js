const Order = require("../model/Order");

// Helper to generate a random 4-digit string orderId
function generate4DigitOrderId() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Helper to check if orderId exists in DB
async function isOrderIdUnique(orderId) {
  const existing = await Order.findOne({ orderId });
  return !existing;
}

// Generate a unique 4-digit orderId (try up to 5 times)
async function generateUniqueOrderId() {
  for (let i = 0; i < 5; i++) {
    const newId = generate4DigitOrderId();
    if (await isOrderIdUnique(newId)) return newId;
  }
  throw new Error("Failed to generate unique orderId, try again");
}

exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Generate unique 4-digit orderId if not provided
    if (!orderData.orderId) {
      orderData.orderId = await generateUniqueOrderId();
    }

    const order = new Order(orderData);
    await order.save();

    res.json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
