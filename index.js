const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./route/User");
const Restaurant = require("./route/Restaurant");
const Menu = require("./route/Menu");
const authRoutes  = require("./route/Auth");

const app = express();
const PORT = process.env.PORT || 2000;

// Middleware FIRST
app.use(cors());
app.use(express.json()); 

// Routes
app.use("/api", userRoutes);
app.use("/api", Menu);
app.use("/api", Restaurant);
app.use("/api/admin", authRoutes);

// DB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB successfully."))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
