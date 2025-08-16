const mongoose = require("mongoose");

const examinationSchema = new mongoose.Schema(
  {
    examinationName: { type: String, required: true },
    description: { type: String },
    protocol: { type: String },
    referenceValue: [{ type: String }],
    resultDelay: { type: Number }, // in days or hours
    technicalUnit: {
      type: String,
      required: true,
    },
    sampleRequirements: {
      requiredSampleType: {
        type: String, // ex: "Sang", "Urine"
        required: true,
      },
      minVolume: {
        type: Number, // en ml
        required: true,
        min: 0.1,
      },
      containerType: {
        type: String, // ex: "Tube EDTA", "Flacon stérile"
        required: true,
      },
    },
    creationDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExaminationType", examinationSchema);
