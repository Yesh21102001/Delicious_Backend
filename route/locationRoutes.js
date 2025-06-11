const express = require("express");
const router = express.Router();
const locationController = require("../controller/locationController"); // ✅ FIXED
const verifyToken = require("../Middleware/verifyToken");

router.post("/save", verifyToken, locationController.saveLocation);
router.get("/", verifyToken, locationController.getLocation);
router.get("/:userId", verifyToken, locationController.getLocationByUserId); // ✅ Now works

module.exports = router;
