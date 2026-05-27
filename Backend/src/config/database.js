const mongoose = require("mongoose");

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Database connection error:", error.message);

    process.exit(1); // stop server if DB connection fails
  }
}

module.exports = connectToDb;
