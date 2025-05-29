const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String, required: true, unique: true },
  identifiant: { type: String, unique: true, required: true }, // ID unique généré
  role: {
    type: String,
    enum: ["Agent Technicien", "Technicien", "Biologiste", "admin"], // Grades en entier
    required: true,
  },
  poste: {
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
      "admin",
    ],
    required: true,
  },
  motDePasse: { type: String, required: true }, // Hashé
  dateCreation: { type: Date, default: Date.now },
  isBlocked: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
