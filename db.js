const mongoose = require("mongoose");

const connectDB = async () => {
  // Ensure we only connect if no active connection
  if (mongoose.connection.readyState === 0) {
    try {
      // Use the environment variable from Render
      const mongoURI = process.env.MONGODB_URI;

      if (!mongoURI) {
        throw new Error("MONGODB_URI is not set in environment variables");
      }

      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log("MongoDB Connected");
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }
  }
};

module.exports = connectDB;
