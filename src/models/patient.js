const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  anonymizedCode: { type: String, required: true, unique: true },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, enum: ["M", "F"], required: true },
  neighborhood: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  occupation: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  department: { type: String, required: true }, // anciennement "service"
  prescribingDoctor: { type: String, required: true }, // anciennement "prescriptor"
  clinicalNote: { type: String, required: true },
});

module.exports = mongoose.model("Patient", patientSchema);
