const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyOTP,
  signInUser,
  initiatePasswordReset,
  verifyPasswordResetOTP,
  resetPassword,
  getAllUsers,
} = require("../controller/User");

router.post("/user/register", registerUser);
router.post("/user/verifyOtp", verifyOTP);
router.post("/user/signIn", signInUser);
router.post("/user/initiatePasswordReset", initiatePasswordReset);
router.post("/user/verifyPasswordResetOTP", verifyPasswordResetOTP);
router.post("/user/resetPassword", resetPassword);
router.get("/user/getAllUsers", getAllUsers);

module.exports = router;
