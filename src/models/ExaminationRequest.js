const mongoose = require("mongoose");

const examinationRequestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Collected", "In Progress", "Completed", "Canceled"],
    default: "Pending",
  },
  requestedByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  requestorDetails: {
    name: { type: String },
    contact: { type: String },
    service: { type: String },
  },
  requestedExaminations: [
    {
      examinationTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExaminationType",
        required: true,
      },
      examinationName: { type: String, required: true },
      isCollected: { type: Boolean, default: false },
      examinationStatus: {
        type: String,
        enum: ["Pending", "Collected", "In Progress", "Completed", "Canceled"],
        default: "Pending",
      },
      payment: {
        amountPaid: { type: Number, required: true },
        paymentType: {
          type: String,
          enum: ["Cash", "Insurance", "Urgency", "Free"],
          required: true,
        },
        paymentMethod: { type: String },
        receiptNumber: { type: String },
        paidBy: { type: String },
        notes: { type: String },
        paymentDetails: {
          insurerName: String,
          contractNumber: String,
          patientShare: Number,
          insuranceShare: Number,
          doctorName: String,
          reasonForFree: String,
          authorizedByUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        },
      },
    },
  ],
  closureDate: { type: Date },
  internalNotes: { type: String },
});

module.exports = mongoose.model("ExaminationRequest", examinationRequestSchema);
