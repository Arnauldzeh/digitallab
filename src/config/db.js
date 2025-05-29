// src/config/db.js
const mongoose = require("mongoose");
const { hashPassword } = require("../services/hash");
const User = require("../models/users");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(" Erreur : MONGODB_URI non défini dans .env !");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(` MongoDB connecté : ${conn.connection.host}`);

    //  Vérifier si un admin existe déjà
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      console.log(" Aucun admin trouvé. Création d'un Super Admin...");

      const hashedPassword = await hashPassword("admin"); // 🔐 Hasher le mot de passe

      const superAdmin = new User({
        nom: "Super",
        prenom: "Admin",
        identifiant: "SA001",
        poste: "Major",
        role: "admin",
        telephone: "0102030405",
        motDePasse: hashedPassword,
      });

      await superAdmin.save();
      console.log(" Super Admin créé avec succès !");
    } else {
      console.log(" Un admin existe déjà !");
    }
  } catch (error) {
    console.error(` Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1); // Arrêter l'application si la connexion échoue
  }
};

module.exports = connectDB;
