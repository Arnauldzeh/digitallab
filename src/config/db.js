// src/config/db.js (Version corrigée et optimisée)
const mongoose = require("mongoose");

// Variable pour mettre en cache la connexion
let cachedDb = null;

const connectDB = async () => {
  // Si la connexion est déjà en cache, on la réutilise
  if (cachedDb) {
    console.log("🚀 Utilisation de la connexion MongoDB en cache !");
    return cachedDb;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Erreur : MONGODB_URI non défini dans .env !");
    }

    console.log("🔌 Nouvelle connexion à MongoDB...");
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Ces options aident à éviter les timeouts dans un environnement serverless
      bufferCommands: false,
    });

    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);

    // Mettre la connexion en cache pour les futurs appels
    cachedDb = conn;
    return conn;
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
    // Ne pas arrêter le processus, laisser Vercel gérer l'erreur de la fonction
    throw error;
  }
};

module.exports = connectDB;
