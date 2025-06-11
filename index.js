const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 
require("dotenv").config();

const userRoutes = require("./route/User");
const Menu = require("./route/Menu");
const authRoutes = require("./route/Auth");
const cart = require("./route/cartRoutes");
const order = require("./route/orderRoutes");
const location = require("./route/locationRoutes");
const Coupons = require("./route/couponRoutes");

const app = express();
const PORT = process.env.PORT || 2000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api", userRoutes);
app.use("/api/menu", Menu);
app.use("/api/admin", authRoutes);
app.use("/api/cart", cart);
app.use("/api/order", order);
app.use("/api/location", location);
app.use("/api/coupon", Coupons);

// DB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB successfully."))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
