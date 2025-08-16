const mongoose = require("mongoose");

const sampleSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    sampleType: { type: String, required: true }, // ex: "Sang", "Urine", "Selles"
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }, // ex: "mL", "g"
    collectionDate: { type: Date, default: Date.now },
    linkedExaminations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExaminationType",
      },
    ],
    status: {
      type: String,
      enum: ["En attente", "Reçu", "Analysé", "Rejeté"],
      default: "En attente",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sample", sampleSchema);
