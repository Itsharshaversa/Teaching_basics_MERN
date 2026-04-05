const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const counterRoutes = require("./routes/counterRoutes");

const app = express();

// MongoDB commented out for Supabase migration
// const connectDB = require("./config/db");
// connectDB();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/counter", counterRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});