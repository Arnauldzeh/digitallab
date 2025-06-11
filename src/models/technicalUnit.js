const mongoose = require("mongoose");

const technicalUnitSchema = new mongoose.Schema({
  unitName: { type: String, required: true, unique: true },
  description: { type: String },
  responsibleUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  creationDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  sampleCapacity: { type: Number, min: 0 },
});

module.exports = mongoose.model("TechnicalUnit", technicalUnitSchema);
