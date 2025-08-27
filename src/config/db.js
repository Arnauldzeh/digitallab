// src/config/db.js
const mongoose = require("mongoose");
const { hashPassword } = require("../services/hash");
const User = require("../models/users");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("❌ Erreur : MONGODB_URI non défini dans .env !");
      return; // Ne pas crash, juste retourner
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 secondes max
    });

    console.log(`✅ MongoDB connected : ${conn.connection.host}`);

    // Vérifier si un admin existe déjà (UNIQUEMENT si la connexion réussit)
    const adminExists = await User.findOne({ qualification: "Admin" });

    if (!adminExists) {
      console.log("ℹ️ Aucun admin trouvé. Création d'un Super Admin...");

      const hashedPassword = await hashPassword("Admin");

      const superAdmin = new User({
        lastName: "Super",
        firstName: "Admin",
        userName: "SA001",
        departments: "Admin",
        qualification: "Admin",
        phoneNumber: "602030405",
        email: "digitalab.app@gmail.com",
        password: hashedPassword,
      });

      await superAdmin.save();
      console.log("✅ Super Admin créé avec succès !");
    } else {
      console.log("ℹ️ Un admin existe déjà !");
    }
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
    // NE PAS UTILISER process.exit(1); ❌
    // Juste logger l'erreur et laisser l'application continuer
  }
};

module.exports = connectDB;
