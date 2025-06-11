const User = require("../model/User");

const generate4DigitUserId = async () => {
  let userId;
  let exists = true;

  while (exists) {
    userId = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit
    const existing = await User.findOne({ userId });
    exists = !!existing;
  }

  return userId;
};

module.exports = generate4DigitUserId;
