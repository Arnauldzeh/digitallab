const mongoose = require("mongoose");
const ExaminationType = require("../models/examination");

// Connexion à la base de données
mongoose.connect("mongodb://localhost:27017/DIGITALAB-DEV", {
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
    sampleRequirements: {
      requiredSampleType: "Selles",
      minVolume: 10,
      containerType: "Pot stérile",
    },
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
    sampleRequirements: {
      requiredSampleType: "Selles",
      minVolume: 10,
      containerType: "Pot stérile",
    },
  },
  {
    examinationName: "RMF",
    description:
      "Parasitologie – Examen microscopique direct des selles pour œufs, kystes, trophozoïtes.",
    protocol: "Observation au microscope en état frais et après coloration.",
    referenceValue: ["Flore normale", "Pas de parasites"],
    resultDelay: 1,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Selles",
      minVolume: 10,
      containerType: "Pot stérile",
    },
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
    sampleRequirements: {
      requiredSampleType: "Selles",
      minVolume: 5,
      containerType: "Pot stérile",
    },
  },
  {
    examinationName: "Skiu suip test",
    description:
      "Test de la sueur pour dépistage de mucoviscidose (probable interprétation).",
    protocol:
      "Stimulation de la sueur, recueil et analyse du taux de chlorure.",
    referenceValue: ["< 40 mmol/L"],
    resultDelay: 1,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Sueur",
      minVolume: 1,
      containerType: "Gaze collectrice spéciale",
    },
  },
  {
    examinationName: "TDR Palu",
    description: "Test de diagnostic rapide du paludisme (Plasmodium spp.).",
    protocol: "Test immunochromatographique sur sang capillaire ou veineux.",
    referenceValue: ["Négatif"],
    resultDelay: 0.5,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Sang",
      minVolume: 1,
      containerType: "Tube EDTA",
    },
  },
  {
    examinationName: "PCV + ATB",
    description: "Prélèvement cervico-vaginal avec antibiogramme.",
    protocol:
      "Ecouvillonnage, culture sur milieux sélectifs, antibiogramme par diffusion.",
    referenceValue: ["Flore normale", "Pas de germe pathogène"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Sécrétions vaginales",
      minVolume: 1,
      containerType: "Ecouvillon stérile",
    },
  },
  {
    examinationName: "PU + ATB",
    description: "Prélèvement urétral avec antibiogramme.",
    protocol: "Ecouvillonnage urétral, culture, antibiogramme.",
    referenceValue: ["Absence de pathogène"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Sécrétions urétrales",
      minVolume: 1,
      containerType: "Ecouvillon stérile",
    },
  },
  {
    examinationName: "Mycoplasme",
    description:
      "Détection de Mycoplasma spp. dans les sécrétions urogénitales.",
    protocol: "PCR ou culture spécifique selon les cas.",
    referenceValue: ["Négatif"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Sécrétions urogénitales",
      minVolume: 1,
      containerType: "Tube sec ou milieu spécifique",
    },
  },
  {
    examinationName: "PV + ATB",
    description: "Prélèvement vaginal avec antibiogramme.",
    protocol: "Ecouvillon vaginal, culture et antibiogramme.",
    referenceValue: ["Flore vaginale normale"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Sécrétions vaginales",
      minVolume: 1,
      containerType: "Ecouvillon stérile",
    },
  },
  {
    examinationName: "ECBU + ATB",
    description: "Examen cytobactériologique des urines avec antibiogramme.",
    protocol:
      "Prélèvement d'urine, culture quantitative, identification et antibiogramme.",
    referenceValue: ["<10^4 UFC/mL", "Pas de pathogène"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Urine",
      minVolume: 10,
      containerType: "Flacon stérile",
    },
  },
  {
    examinationName: "LCR + ZTB",
    description:
      "Analyse du LCR avec recherche de bacilles acido-alcoolo résistants.",
    protocol: "Ponction lombaire, culture, coloration Ziehl-Neelsen.",
    referenceValue: ["Liquide clair, stérile", "ZTB négatif"],
    resultDelay: 3,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "LCR",
      minVolume: 1,
      containerType: "Tube stérile",
    },
  },
  {
    examinationName: "Hémoculture",
    description: "Culture de sang pour détection de bactéries pathogènes.",
    protocol: "Prélèvement aseptique, incubation en milieux enrichis.",
    referenceValue: ["Pas de croissance"],
    resultDelay: 3,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Sang",
      minVolume: 10,
      containerType: "Flacon hémoculture",
    },
  },
  {
    examinationName: "Spermogramme",
    description: "Analyse quantitative et qualitative du sperme.",
    protocol: "Recueil après abstinence, analyse rapide en laboratoire.",
    referenceValue: [">15M/mL", "Mobilité >40%"],
    resultDelay: 1,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Sperme",
      minVolume: 2,
      containerType: "Pot stérile",
    },
  },
  {
    examinationName: "Spermoculture",
    description: "Culture du sperme pour recherche d’infection.",
    protocol: "Ensemencement sur milieux standards, incubation.",
    referenceValue: ["Absence de pathogène"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Sperme",
      minVolume: 2,
      containerType: "Pot stérile",
    },
  },
  {
    examinationName: "Coproculture",
    description: "Recherche de bactéries pathogènes dans les selles.",
    protocol: "Culture sur milieux sélectifs : MacConkey, XLD, SS, etc.",
    referenceValue: ["Flore normale", "Pas de Salmonella/Shigella"],
    resultDelay: 3,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Selles",
      minVolume: 10,
      containerType: "Pot stérile",
    },
  },
  {
    examinationName: "Ponction - Ascite",
    description: "Analyse microbiologique du liquide d’ascite.",
    protocol: "Ponction, culture, coloration de Gram.",
    referenceValue: ["Liquide clair, stérile"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Liquide d'ascite",
      minVolume: 3,
      containerType: "Tube stérile",
    },
  },
  {
    examinationName: "Ponction - Pleural",
    description: "Analyse du liquide pleural.",
    protocol: "Ponction pleurale, culture, Gram, biochimie.",
    referenceValue: ["Liquide stérile"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Liquide pleural",
      minVolume: 3,
      containerType: "Tube stérile",
    },
  },
  {
    examinationName: "Ponction - Articulaire",
    description: "Culture du liquide articulaire pour recherche d’infection.",
    protocol: "Ponction articulaire, culture sur milieux appropriés.",
    referenceValue: ["Stérile"],
    resultDelay: 2,
    technicalUnit: "MICROBIOLOGIE",
    sampleRequirements: {
      requiredSampleType: "Liquide articulaire",
      minVolume: 3,
      containerType: "Tube stérile",
    },
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
