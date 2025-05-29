const crypto = require("crypto");

const generateUserId = (nom, prenom, grade, role) => {
  // Nettoyage des noms (suppression des accents, espaces, etc.)
  const cleanString = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
      .replace(/\s+/g, "") // Supprime les espaces
      .toUpperCase();

  const initiales = `${cleanString(nom).charAt(0)}${cleanString(prenom).charAt(
    0
  )}`;

  // Associer le grade à son code
  const gradeMap = {
    "Agent Technicien": "AT",
    Technicien: "TS",
    Biologiste: "BIO",
    Major: "MAJ",
  };
  const gradeCode = gradeMap[grade] || "UNK"; // `UNK` pour inconnu

  // Associer le rôle à son code (unités du labo)
  const roleMap = {
    Biochimie: "BIO",
    Hématologie: "HEM",
    Immunologie: "IMM",
    Microbiologie: "MIC",
    Parasitologie: "PAR",
    Virologie: "VIR",
    Anatomopathologie: "ANA",
    Génétique: "GEN",
    Toxicologie: "TOX",
    Bactériologie: "BAC",
    Sérologie: "SER",
    Endocrinologie: "END",
    Mycologie: "MYC",
    Accueil: "ACC",
  };
  const roleCode = roleMap[role] || "UNK";

  // Ajout de l'année d'inscription
  const year = new Date().getFullYear().toString().slice(-2);

  // Génération d'un ID unique sécurisé
  const randomHash = crypto.randomBytes(2).toString("hex").toUpperCase();

  // Concaténation finale
  return `${initiales}${gradeCode}${roleCode}${year}${randomHash}`;
};

module.exports = { generateUserId };
