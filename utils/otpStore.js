const otpStore = new Map(); // Using a Map to store OTPs in memory

// Store OTP with an expiration
const storeOTP = (identifier, otp, expiresInMs) => {
  
  otpStore.set(identifier, { otp, expiresAt: Date.now() + expiresInMs });

  // Automatically delete the OTP after it expires
  setTimeout(() => otpStore.delete(identifier), expiresInMs);
};

// Verify OTP
const verifyOTP = (identifier, otp) => {
  const otpData = otpStore.get(identifier);

  if (!otpData) {
    return false; // OTP not found or expired
  }

  if (otpData.otp === otp && otpData.expiresAt > Date.now()) {
    otpStore.delete(identifier); // OTP is valid, delete it after verification
    return true;
  }

  return false;
};

module.exports = { storeOTP, verifyOTP };
