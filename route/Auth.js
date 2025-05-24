// routes/authRoute.js
const express = require('express');
const router = express.Router();
const { loginAdmin, dashboard } = require("../controller/Auth");
const authenticateJWT = require("../Middleware/Auth");

// Public login route
router.post('/login', loginAdmin);
router.get('/dashboard', authenticateJWT, dashboard);

module.exports = router;