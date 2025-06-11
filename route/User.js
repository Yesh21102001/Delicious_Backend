const express = require("express");
const router = express.Router();
const {
  sendOTP,
  register,
  login,
  getCurrentUser,
} = require("../controller/User");

const verifyToken = require("../Middleware/verifyToken");

router.post("/send-otp", sendOTP);
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser); // 🔒 Protected route

module.exports = router;
