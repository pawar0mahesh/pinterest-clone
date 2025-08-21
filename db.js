// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) { // only connect if no active connection
    try {
      const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://maheshpawar2010:<Pawar321Singh02>@cluster1.toedkwc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';
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
