// controller/Auth.js
const jwt = require('jsonwebtoken');
const Admin = require("../model/Admin");

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.validateCredentials(email, password);

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      message: 'Login successful',
      token: token
    });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.dashboard = (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard!' });
};
