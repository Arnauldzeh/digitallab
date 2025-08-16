const mongoose = require("mongoose");
const TechnicalUnit = require("../models/technicalUnit"); // Vérifie le chemin

mongoose.connect("mongodb://localhost:27017/DIGITALAB-DEV", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const unitesTechniques = [
  {
    unitName: "Microbiologie",
    description: "Gère les examens de parasitologie et de bactériologie.",
    isActive: true,
    sampleCapacity: 100,
    creationDate: new Date(),
    responsibleUsers: null,
  },
  {
    unitName: "Hématologie",
    description:
      "Gère les analyses sanguines comme la NFS, la coagulation, etc.",
    isActive: true,
    sampleCapacity: 80,
    creationDate: new Date(),
    responsibleUsers: null,
  },
  {
    unitName: "Biochimie",
    description: "Effectue des tests biochimiques (foie, rein, etc.).",
    isActive: true,
    sampleCapacity: 120,
    creationDate: new Date(),
    responsibleUsers: null,
  },
  {
    unitName: "Immunologie",
    description: "Prend en charge les examens sérologiques et immunitaires.",
    isActive: true,
    sampleCapacity: 90,
    creationDate: new Date(),
    responsibleUsers: null,
  },
  {
    unitName: "Virologie",
    description: "S’occupe de la détection et quantification des virus.",
    isActive: true,
    sampleCapacity: 70,
    creationDate: new Date(),
    responsibleUsers: null,
  },
];

async function seed() {
  try {
    await TechnicalUnit.deleteMany(); // Supprime les anciennes données
    await TechnicalUnit.insertMany(unitesTechniques);
    console.log("Unités techniques insérées avec succès.");
    mongoose.disconnect();
  } catch (err) {
    console.error("Erreur lors du peuplement :", err);
  }
}

seed();
