const mongoose = require("mongoose");
const ExaminationType = require("../models/examination"); // adapte le chemin si nécessaire

// Connexion à la base de données
mongoose.connect("mongodb://localhost:27017/DIGITALAB-SOLUTION", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const microbiologyExaminations = [
  {
    examinationName: "Coprologie",
    description:
      "Parasitologie – Recherche de parasites intestinaux dans les selles.",
    protocol:
      "Prélèvement de selles fraîches, examen direct et après concentration.",
    referenceValue: ["Absence de parasites"],
    resultDelay: 1,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "GE",
    description:
      "Parasitologie – Recherche de Giardia intestinalis et Entamoeba histolytica.",
    protocol:
      "Analyse microscopique des selles, test immunologique si nécessaire.",
    referenceValue: ["Négatif", "Absence de Giardia/Entamoeba"],
    resultDelay: 1,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "RMF",
    description:
      "Parasitologie – Examen microscopique direct des selles pour œufs, kystes, trophozoïtes.",
    protocol: "Observation au microscope en état frais et après coloration.",
    referenceValue: ["Flore normale", "Pas de parasites"],
    resultDelay: 1,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "Sang occulte",
    description:
      "Parasitologie – Détection de sang invisible à l'œil nu dans les selles.",
    protocol:
      "Test immunochimique ou colorimétrique sur échantillon de selles.",
    referenceValue: ["Négatif"],
    resultDelay: 1,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "Skiu suip test",
    description:
      "Parasitologie – Test de la sueur pour dépistage de mucoviscidose (probable interprétation).",
    protocol:
      "Stimulation de la sueur, recueil et analyse du taux de chlorure.",
    referenceValue: ["< 40 mmol/L"],
    resultDelay: 1,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "TDR Palu",
    description:
      "Parasitologie – Test de diagnostic rapide du paludisme (Plasmodium spp.).",
    protocol: "Test immunochromatographique sur sang capillaire ou veineux.",
    referenceValue: ["Négatif"],
    resultDelay: 0.5,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "PCV + ATB",
    description:
      "Bactériologie – Prélèvement cervico-vaginal avec antibiogramme.",
    protocol:
      "Ecouvillonnage, culture sur milieux sélectifs, antibiogramme par diffusion.",
    referenceValue: ["Flore normale", "Pas de germe pathogène"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "PU + ATB",
    description: "Bactériologie – Prélèvement urétral avec antibiogramme.",
    protocol: "Ecouvillonnage urétral, culture, antibiogramme.",
    referenceValue: ["Absence de pathogène"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "Mycoplasme",
    description:
      "Bactériologie – Détection de Mycoplasma spp. dans les sécrétions urogénitales.",
    protocol: "PCR ou culture spécifique selon les cas.",
    referenceValue: ["Négatif"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "PV + ATB",
    description: "Bactériologie – Prélèvement vaginal avec antibiogramme.",
    protocol: "Ecouvillon vaginal, culture et antibiogramme.",
    referenceValue: ["Flore vaginale normale"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "ECBU + ATB",
    description:
      "Bactériologie – Examen cytobactériologique des urines avec antibiogramme.",
    protocol:
      "Prélèvement d'urine, culture quantitative, identification et antibiogramme.",
    referenceValue: ["<10^4 UFC/mL", "Pas de pathogène"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "LCR + ZTB",
    description:
      "Bactériologie – Analyse du LCR avec recherche de bacilles acido-alcoolo résistants.",
    protocol: "Ponction lombaire, culture, coloration Ziehl-Neelsen.",
    referenceValue: ["Liquide clair, stérile", "ZTB négatif"],
    resultDelay: 3,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "Hémoculture",
    description:
      "Bactériologie – Culture de sang pour détection de bactéries pathogènes.",
    protocol: "Prélèvement aseptique, incubation en milieux enrichis.",
    referenceValue: ["Pas de croissance"],
    resultDelay: 3,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "Spermogramme",
    description:
      "Bactériologie – Analyse quantitative et qualitative du sperme.",
    protocol: "Recueil après abstinence, analyse rapide en laboratoire.",
    referenceValue: [">15M/mL", "Mobilité >40%"],
    resultDelay: 1,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "Spermoculture",
    description:
      "Bactériologie – Culture du sperme pour recherche d’infection.",
    protocol: "Ensemencement sur milieux standards, incubation.",
    referenceValue: ["Absence de pathogène"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "Coproculture",
    description:
      "Bactériologie – Recherche de bactéries pathogènes dans les selles.",
    protocol: "Culture sur milieux sélectifs : MacConkey, XLD, SS, etc.",
    referenceValue: ["Flore normale", "Pas de Salmonella/Shigella"],
    resultDelay: 3,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "Ponction - Ascite",
    description: "Bactériologie – Analyse microbiologique du liquide d’ascite.",
    protocol: "Ponction, culture, coloration de Gram.",
    referenceValue: ["Liquide clair, stérile"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "Ponction - Pleural",
    description: "Bactériologie – Analyse du liquide pleural.",
    protocol: "Ponction pleurale, culture, Gram, biochimie.",
    referenceValue: ["Liquide stérile"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
  },
  {
    examinationName: "Ponction - Articulaire",
    description:
      "Bactériologie – Culture du liquide articulaire pour recherche d’infection.",
    protocol: "Ponction articulaire, culture sur milieux appropriés.",
    referenceValue: ["Stérile"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
  },
];

async function seed() {
  try {
    await ExaminationType.deleteMany(); // Supprime les anciennes données
    await ExaminationType.insertMany(microbiologyExaminations);
    console.log("Microbiology examinations inserted successfully.");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error inserting examinations:", error);
  }
}

seed();
