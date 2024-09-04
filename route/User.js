const express = require("express");
const router = express.Router();
const { registerUser, verifyOTP, signInUser } = require("../controller/User");

router.post("/user/register", registerUser);
router.post("/user/verifyOtp", verifyOTP);
router.post("/user/signIn", signInUser);

module.exports = router;
