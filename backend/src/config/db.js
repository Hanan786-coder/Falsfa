// config/db.js - MongoDB Database Connection

// Uses Mongoose to connect to MongoDB.
// Called once at server startup from server.js.
 
const mongoose = require("mongoose");
 
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Exit process with failure if DB connection fails
    process.exit(1);
  }
};
 
module.exports = connectDB;