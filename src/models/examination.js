const mongoose = require("mongoose");

const examinationSchema = new mongoose.Schema({
  examinationName: { type: String, required: true },
  description: { type: String },
  protocol: { type: String },
  referenceValue: [{ type: String }],
  resultDelay: { type: Number }, // in days or hours
  technicalUnit: {
    type: String,
    required: true,
  },
  creationDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("ExaminationType", examinationSchema);
