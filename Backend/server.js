const express = require("express");
const cors = require("cors");
const connectDB = require("./connection/database.js");
const productRoutes = require("./routes/productRoutes.js");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Enable express.json to parse JSON payloads
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use("/api", productRoutes);

app.listen(3000, () => {
  console.log(`Server is running on port`);
});
