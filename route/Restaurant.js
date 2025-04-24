const express = require("express");
const { toggleRestaurantStatus, getMenuIfOnline } = require("../controller/Restaurant");
const router = express.Router();

// Toggle Online/Offline
router.patch("/toggle-status/:restaurantId", toggleRestaurantStatus);
router.get("/menu/:restaurantId", getMenuIfOnline);

module.exports = router;