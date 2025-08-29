require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    if (process.env.IS_LOCAL === "true") {
      const port = process.env.PORT || 5000;
      app.listen(port, () => {
        console.log(`🚀 Server running locally on port ${port}`);
      });
    }
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Arrête si Mongo ne marche pas
  }
};

startServer();

module.exports = app;
