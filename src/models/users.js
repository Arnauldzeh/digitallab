const mongoose = require("mongoose");
const { encrypt, decrypt } = require("../services/cryptoService");

const userSchema = new mongoose.Schema(
  {
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
    hiredAt: { type: Date, default: Date.now },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true, // <-- Ajoutez cette option ici !
  }
);

// // 🛡️ Chiffrement avant sauvegarde
// userSchema.pre("save", function (next) {
//   if (this.isModified("lastName")) this.lastName = encrypt(this.lastName);
//   if (this.isModified("firstName")) this.firstName = encrypt(this.firstName);
//   if (this.isModified("email")) this.email = encrypt(this.email);
//   if (this.isModified("phoneNumber"))
//     this.phoneNumber = encrypt(this.phoneNumber);
//   next();
// });

// // 🔓 Méthode de déchiffrement après lecture
// userSchema.methods.decryptFields = function () {
//   this.lastName = decrypt(this.lastName);
//   this.firstName = decrypt(this.firstName);
//   this.email = decrypt(this.email);
//   this.phoneNumber = decrypt(this.phoneNumber);
// };

module.exports = mongoose.model("User", userSchema);
