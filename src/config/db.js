const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Désactiver le buffering des commandes
    mongoose.set("bufferCommands", false);

    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/digitalab",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false, // Désactiver le buffering
      }
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
