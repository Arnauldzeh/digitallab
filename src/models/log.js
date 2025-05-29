const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Optionnel si action anonyme
  action: { type: String, required: true },
  details: { type: String, required: false },
  timestamp: { type: Date, default: Date.now },
  ip: { type: String, required: false },
});

const Log = mongoose.model("Log", logSchema);
module.exports = Log;
