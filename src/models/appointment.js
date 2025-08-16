const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    examens: [
      {
        examinationName: { type: String, required: true },
        motif: { type: String, required: true },
        dateRDV: { type: String, required: true }, // Format YYYY-MM-DD
        heureRDV: { type: String, required: true }, // Format HH:mm
        statut: {
          type: String,
          enum: ["En attente", "Confirmé", "Annulé", "Terminé"],
          default: "En attente",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
