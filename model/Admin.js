// models/adminModel.js
const bcrypt = require('bcryptjs');

// You can use this model to validate the admin credentials (email and password)

class Admin {
  static async validateCredentials(email, password) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return null; 
    }

    return { email: adminEmail };
  }
}

module.exports = Admin;
