const AnalysisRequest = require("../models/analysisRequest");
const Sample = require("../models/sample");

// ✅ Créer un prélèvement
const newSample = async (req, res) => {
  try {
    const sample = new Sample(req.body);
    await sample.save();
    res.status(201).json(sample);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const rejectRequestedExamination = async (req, res) => {
  try {
    const { id } = req.params; // id de la demande d'examen
    const { examinationTypeId, reason } = req.body; // ID de l'examen à rejeter et raison optionnelle

    // Récupérer la demande
    const examRequest = await AnalysisRequest.findById(id);
    if (!examRequest) {
      return res.status(404).json({ message: "Demande d'examen non trouvée" });
    }

    // Trouver l'examen demandé dans la liste
    const requestedExam = examRequest.requestedExaminations.find(
      (exam) => exam.examinationTypeId.toString() === examinationTypeId
    );

    if (!requestedExam) {
      return res.status(404).json({ message: "Examen demandé non trouvé" });
    }

    // Mettre à jour le statut à "Rejected" uniquement si ce n'est pas déjà le cas
    if (requestedExam.examinationStatus === "Rejected") {
      return res.status(400).json({ message: "Examen déjà rejeté" });
    }

    requestedExam.examinationStatus = "Rejected";

    // Optionnel : ajouter une note interne dans la demande avec la raison
    if (reason) {
      examRequest.internalNotes = examRequest.internalNotes
        ? examRequest.internalNotes +
          `\nRejet examen ${requestedExam.examinationName} : ${reason}`
        : `Rejet examen ${requestedExam.examinationName} : ${reason}`;
    }

    await examRequest.save();

    return res.status(200).json({
      message: `Examen '${requestedExam.examinationName}' rejeté avec succès`,
      examRequest,
    });
  } catch (error) {
    console.error("Erreur lors du rejet de l'examen demandé :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const getRejectedExams = async (req, res) => {
  try {
    // Recherche de toutes les demandes contenant au moins un examen rejeté
    const requests = await AnalysisRequest.find({
      "requestedExaminations.examinationStatus": "Rejected",
    }).populate("patientId", "anonymizedCode firstName lastName phoneNumber");

    const rejectedExams = [];

    for (const req of requests) {
      for (const exam of req.requestedExaminations) {
        if (exam.examinationStatus === "Rejected") {
          rejectedExams.push({
            requestId: req._id,
            patient: {
              anonymizedCode: req.patientId?.anonymizedCode || "Inconnu",
              firstName: req.patientId?.firstName || "Inconnu",
              lastName: req.patientId?.lastName || "Inconnu",
              phoneNumber: req.patientId?.phoneNumber || "Inconnu",
            },
            examinationName: exam.examinationName,
            examinationTypeId: exam.examinationTypeId,
            payment: exam.payment,
            examinationStatus: exam.examinationStatus,
          });
        }
      }
    }

    return res.status(200).json({ rejectedExams });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des examens rejetés :",
      error
    );
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { getRejectedExams, rejectRequestedExamination, newSample };
