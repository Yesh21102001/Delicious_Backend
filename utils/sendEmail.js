const nodemailer = require("nodemailer");

// Load environment variables from .env file
require("dotenv").config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // You can use other email services
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable for email
    pass: process.env.EMAIL_PASSWORD, // Use environment variable for password
  },
});

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Use environment variable for sender address
      to: email, // List of receivers
      subject: "Your OTP Code", // Subject line
      text: `Your OTP code is ${otp}`, // Plain text body
    });
    console.log("OTP email sent successfully",otp);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

module.exports = sendOTPEmail;
