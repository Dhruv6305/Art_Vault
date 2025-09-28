const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from your .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully!');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Exit the process with a failure code if connection fails
    process.exit(1);
  }
};

module.exports = connectDB;