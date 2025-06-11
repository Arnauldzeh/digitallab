const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    examinationRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExaminationRequest",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentType: {
      type: String,
      enum: ["Cash", "Insurance", "Urgency", "Free"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Mobile Money", "Cash", "Bank Transfer", "N/A"],
      default: "N/A",
    },
    receiptNumber: {
      type: String,
    },
    paidBy: {
      type: String,
    },
    recordedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Champs spécifiques selon le type
    insuranceDetails: {
      insurerName: String,
      contractNumber: String,
      patientShare: Number,
      insuranceShare: Number,
    },
    urgencyDetails: {
      doctorName: String,
      reasonForUrgency: String,
    },
    freeDetails: {
      reasonForFree: String,
      authorizedByUserId: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
