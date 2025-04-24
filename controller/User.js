const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const generateOTP = require("../utils/otpGenerator");
const sendOTPEmail = require("../utils/sendEmail");
const otpHandler = require("../utils/otpStore");

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({
        message: "Full name, email, phone number, and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in memory with an expiration (e.g., 5 minutes = 300000 ms)
    otpHandler.storeOTP(email, otp, 300000);

    // Send OTP to user's email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      message:
        "Registration initiated. An OTP has been sent to your email. Please complete the verification process.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// OTP verification function
exports.verifyOTP = async (req, res) => {
  try {
    const { fullName, phoneNumber, otp, email, password } = req.body;

    if (!otp || !fullName || !phoneNumber || !email || !password) {
      return res.status(400).json({
        message:
          "OTP, full name, phone number, email, and password are required",
      });
    }

    // Verify OTP
    const isOTPValid = otpHandler.verifyOTP(email, otp);
    if (!isOTPValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP is valid, now proceed to hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      fullName,
      phoneNumber,
      password: hashedPassword,
      isVerified: true,
    });

    await user.save();

    res
      .status(200)
      .json({ message: "User verified and registration complete", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Sign-in function
exports.signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message:
          "User is not verified. Please complete the verification process.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, 
      { expiresIn: "1h" } 
    );

    res.status(200).json({
      message: "User signed in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Step 1: Initiate Password Reset - Send OTP
exports.initiatePasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User with this email does not exist" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in memory with an expiration (e.g., 5 minutes = 300000 ms)
    otpHandler.storeOTP(email, otp, 300000);

    // Send OTP to user's email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to your email. Please verify to reset your password.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Step 2: Verify OTP
exports.verifyPasswordResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!otp || !email) {
      return res.status(400).json({
        message: "OTP and email are required",
      });
    }

    // Verify OTP
    const isOTPValid = otpHandler.verifyOTP(email, otp);
    if (!isOTPValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    otpHandler.storeVerifiedStatus(email);

    res.status(200).json({ message: "OTP verified successfully. You can now reset your password." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Step 3: Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    // Check if OTP was verified
    const isOTPVerified = otpHandler.isVerified(email);
    if (!isOTPVerified) {
      return res.status(400).json({ message: "OTP not verified. Please verify OTP first." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Clear verification status
    otpHandler.clearVerifiedStatus(email);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users from the database

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ message: "Users retrieved successfully", users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
