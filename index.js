// index.js (main server file)

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./route/User");

// Load environment variables from .env file
require("dotenv").config();

const app = express();

// Use the port from the environment variable or default to 2000
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB using the URI from the environment variable
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB successfully.");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Use the user routes
app.use("/api", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
