// // seed.js (à créer à la racine de votre projet)
// require("dotenv").config(); // Pour charger les variables d'environnement
// const mongoose = require("mongoose");
// const { hashPassword } = require("./src/services/hash"); // Adaptez le chemin
// const User = require("./src/models/users"); // Adaptez le chemin

// const seedAdmin = async () => {
//   try {
//     if (!process.env.MONGODB_URI) {
//       throw new Error("MONGODB_URI non défini !");
//     }

//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("Connecté à MongoDB pour le seeding.");

//     const adminExists = await User.findOne({ qualification: "Admin" });

//     if (!adminExists) {
//       console.log("Création du Super Admin...");
//       const hashedPassword = await hashPassword("Admin");

//       const superAdmin = new User({
//         lastName: "Super",
//         firstName: "Admin",
//         userName: "SA001",
//         departments: "Admin",
//         qualification: "Admin",
//         phoneNumber: "602030405",
//         email: "digitalab.app@gmail.com",
//         password: hashedPassword,
//       });

//       await superAdmin.save();
//       console.log("✅ Super Admin créé avec succès !");
//     } else {
//       console.log("ℹ️ Un admin existe déjà, aucune action requise.");
//     }
//   } catch (error) {
//     console.error("Erreur lors du seeding de l'admin:", error.message);
//   } finally {
//     // Toujours fermer la connexion
//     await mongoose.disconnect();
//     console.log("Déconnecté de MongoDB.");
//   }
// };

// seedAdmin();
