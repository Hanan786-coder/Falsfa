// config/db.js - MongoDB Database Connection
// Supports Vercel serverless (connection caching) and local development.

const mongoose = require("mongoose");

let isConnected = false; // Cache connection state across warm invocations

const connectDB = async () => {
  // If already connected (warm serverless invocation), skip
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!dbUri) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    const conn = await mongoose.connect(dbUri);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Failed to connect to MongoDB: ${err.message}`);
    // In serverless, don't kill the process — throw so the request gets a 500
    throw err;
  }
};

module.exports = connectDB;