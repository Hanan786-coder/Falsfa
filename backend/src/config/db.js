// config/db.js - MongoDB Database Connection
// Supports both a real MongoDB URI and an in-memory server for development.

const mongoose = require("mongoose");

let mongoServer = null; // Holds the MongoMemoryServer instance

const connectDB = async () => {
  try {
    let dbUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    // Attempt connection to the configured URI first
    try {
      const conn = await mongoose.connect(dbUri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn(`⚠️  Could not connect to ${dbUri}: ${err.message}`);
  
    }
  } catch (err) {
    console.error(`Failed to connect to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;