const otpStore = new Map();
const verifiedStore = new Map();

module.exports.storeOTP = (email, otp, ttl) => {
  otpStore.set(email, { otp, expiresAt: Date.now() + ttl });
};

module.exports.verifyOTP = (email, otp) => {
  const otpData = otpStore.get(email);
  if (!otpData) return false;

  const { otp: storedOTP, expiresAt } = otpData;
  if (Date.now() > expiresAt) {
    otpStore.delete(email);
    return false;
  }

  if (storedOTP !== otp) return false;

  otpStore.delete(email);
  return true;
};

module.exports.storeVerifiedStatus = (email) => {
  verifiedStore.set(email, true);
};

module.exports.isVerified = (email) => {
  return verifiedStore.get(email) || false;
};

module.exports.clearVerifiedStatus = (email) => {
  verifiedStore.delete(email);
};
