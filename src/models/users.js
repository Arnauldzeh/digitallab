const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  userName: { type: String, unique: true, required: true }, // Auto-generated ID
  qualification: {
    type: String,
    enum: ["Agent Technicien", "Technicien", "Biologiste", "Admin", "Major"], // translated grades
    required: true,
  },
  department: {
    type: String,
    enum: [
      "Biochimie",
      "Hématologie",
      "Immunologie",
      "Microbiologie",
      "Parasitologie",
      "Virologie",
      "Anatomopathologie",
      "Génétique",
      "Toxicologie",
      "Bactériologie",
      "Sérologie",
      "Endocrinologie",
      "Mycologie",
      "Accueil",
      "Prélèvement",
      "Admin",
      "Major",
    ],
    required: true,
  },
  password: { type: String, required: true }, // Hashed password
  createdAt: { type: Date, default: Date.now },
  hiredAt: { type: Date, default: Date.now },
  isBlocked: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
