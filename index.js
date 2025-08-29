require("dotenv").config();
const app = require("./app");
const connectDB = require("./src/config/db");

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}...`));
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
