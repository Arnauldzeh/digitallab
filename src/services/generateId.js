const crypto = require("crypto");

const generateUserId = (lastName, firstName, qualification, department) => {
  // Clean up strings: remove accents, spaces, etc.
  const cleanString = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/\s+/g, "") // Remove spaces
      .toUpperCase();

  const initials = `${cleanString(lastName).charAt(0)}${cleanString(
    firstName
  ).charAt(0)}`;

  // Role-to-code mapping (grade)
  const roleMap = {
    "Agent Technicien": "TA",
    Technicien: "TS",
    Biologiste: "BIO",
    Major: "SUP",
    Admin: "ADM",
  };
  const roleCode = roleMap[qualification] || "UNK";

  // Department-to-code mapping
  const deptMap = {
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
    Accueil: "REC",
    Prélèvement: "SMP",
    Admin: "ADM",
    Major: "SUP",
  };
  const deptCode = deptMap[department] || "UNK";

  // Add year
  const year = new Date().getFullYear().toString().slice(-2);

  // Secure short random hash
  const randomHash = crypto.randomBytes(2).toString("hex").toUpperCase();

  // Final ID
  return `${initials}${roleCode}${deptCode}${year}${randomHash}`;
};

module.exports = { generateUserId };
