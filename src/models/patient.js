const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../services/cryptoService");

const patientSchema = new mongoose.Schema(
  {
    anonymizedCode: { type: String, unique: true },
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
    clinicalNote: { type: String },
  },
  {
    timestamps: true, // <-- Ajoutez cette option ici !
  }
);

// 🛡️ Chiffrement avant sauvegarde
patientSchema.pre("save", function (next) {
  if (this.isModified("lastName")) this.lastName = encrypt(this.lastName);
  if (this.isModified("firstName")) this.firstName = encrypt(this.firstName);
  if (this.isModified("email")) this.email = encrypt(this.email);
  if (this.isModified("phoneNumber"))
    this.phoneNumber = encrypt(this.phoneNumber);
  next();
});

// 🔓 Méthode de déchiffrement après lecture
patientSchema.methods.decryptFields = function () {
  this.lastName = decrypt(this.lastName);
  this.firstName = decrypt(this.firstName);
  this.email = decrypt(this.email);
  this.phoneNumber = decrypt(this.phoneNumber);
};
module.exports =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);
