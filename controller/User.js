const User = require("../model/User");
const generate4DigitUserId = require("../utils/generateUserId");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const API_KEY = process.env.API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

const otpSessions = new Map();

// Normalize phone
const normalizePhone = (phone) => phone.replace(/\D/g, "").slice(-10);

// ✅ Send OTP
exports.sendOTP = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone is required" });

  const formattedPhone = `+91${normalizePhone(phone)}`;

  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${API_KEY}/SMS/${formattedPhone}/AUTOGEN`
    );

    if (response.data.Status !== "Success") {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    otpSessions.set(normalizePhone(phone), response.data.Details);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};

// ✅ Register User
exports.register = async (req, res) => {
  const { name, email, phone, otp } = req.body;

  if (!name || !email || !phone || !otp)
    return res.status(400).json({ message: "All fields are required" });

  const normalizedPhone = normalizePhone(phone);
  const sessionId = otpSessions.get(normalizedPhone);

  if (!sessionId) return res.status(400).json({ message: "Please request OTP first" });

  try {
    const verifyRes = await axios.get(
      `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
    );

    if (verifyRes.data.Status !== "Success")
      return res.status(400).json({ message: "Invalid OTP" });

    const existingUser = await User.findOne({ phone: normalizedPhone });
    if (existingUser)
      return res.status(400).json({ message: "User already registered" });

    const userId = await generate4DigitUserId();

    const user = new User({
      name,
      email,
      phone: normalizedPhone,
      userId,
      isVerified: true,
    });

    await user.save();
    otpSessions.delete(normalizedPhone);

    const token = jwt.sign({ id: user.userId }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Registration successful", token, userId: user.userId });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// ✅ Login User
exports.login = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp)
    return res.status(400).json({ message: "Phone and OTP are required" });

  const normalizedPhone = normalizePhone(phone);
  const sessionId = otpSessions.get(normalizedPhone);

  if (!sessionId) return res.status(400).json({ message: "Please request OTP first" });

  try {
    const verifyRes = await axios.get(
      `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
    );

    if (verifyRes.data.Status !== "Success")
      return res.status(400).json({ message: "Invalid OTP" });

    const user = await User.findOne({ phone: normalizedPhone });
    if (!user)
      return res.status(404).json({ message: "User not found, please register first" });

    otpSessions.delete(normalizedPhone);

    const token = jwt.sign({ id: user.userId }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token, userId: user.userId });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// ✅ Get current user from token
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ userId });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      userId: user.userId,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};
