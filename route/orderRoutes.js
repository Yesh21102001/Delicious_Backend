const express = require("express");
const router = express.Router();
const { createOrder, getOrderById } = require("../controller/orderController");

router.post("/create", createOrder);
router.get("/:orderId", getOrderById);

module.exports = router;
