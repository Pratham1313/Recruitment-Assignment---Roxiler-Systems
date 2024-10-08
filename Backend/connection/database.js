const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://prathameshgayake2:QmOCa1MmRIvJ7pBZ@sales.l8gea.mongodb.net/?retryWrites=true&w=majority&appName=Sales"
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
