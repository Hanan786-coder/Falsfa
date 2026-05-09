// config/db.js - MongoDB Database Connection
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!dbUri) {
      throw new Error("MongoDB URI is missing in environment variables. Please check your .env file.");
    }

    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;