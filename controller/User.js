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

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }

    // Verify the user's account is verified
    if (!user.isVerified) {
      return res.status(400).json({
        message:
          "User is not verified. Please complete the verification process.",
      });
    }

    // Compare password with hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Use JWT secret from environment variable
      { expiresIn: "1h" } // Token expiration time
    );

    res.status(200).json({
      message: "User signed in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
