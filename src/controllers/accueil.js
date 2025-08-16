const { ObjectId } = require("mongodb");
const Patient = require("../models/patient");
const ExaminationType = require("../models/examination");
const AnalysisRequest = require("../models/analysisRequest");
const Payment = require("../models/payment");
const logAction = require("../config/logger");

const newPatient = async (req, res) => {
  try {
    const {
      lastName,
      firstName,
      birthDate,
      gender,
      neighborhood,
      phoneNumber,
      occupation,
      email,
      department,
      prescribingDoctor,
      clinicalNote,
    } = req.body;

    if (
      !lastName ||
      !firstName ||
      !birthDate ||
      !gender ||
      !phoneNumber ||
      !neighborhood ||
      !occupation ||
      !department ||
      !prescribingDoctor
    ) {
      return res
        .status(400)
        .json({ message: "Champs obligatoires manquants." });
    }

    const anonymizedCode =
      (lastName[0] || "") +
      (firstName[0] || "") +
      Date.now().toString().slice(-5);

    const existing = await Patient.findOne({ anonymizedCode });
    if (existing) {
      return res.status(409).json({ message: "Code anonymat déjà existant." });
    }

    const patient = new Patient({
      anonymizedCode,
      lastName,
      firstName,
      birthDate,
      gender,
      neighborhood,
      phoneNumber,
      occupation,
      email,
      department,
      prescribingDoctor,
      clinicalNote,
    });

    await patient.save();

    return res.status(201).json({
      message: "Patient créé avec succès.",
      patientId: patient._id,
      anonymizedCode: patient.anonymizedCode,
    });
  } catch (error) {
    console.error("Erreur création patient:", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

const newExamination = async (req, res) => {
  const ip = req.ip;
  const userId = req.user ? req.user._id : null;

  try {
    const { anonymizedCode, exams } = req.body;

    if (!exams || !exams.length) {
      return res.status(400).json({ message: "Aucun examen sélectionné." });
    }

    const patient = await Patient.findOne({ anonymizedCode });
    if (!patient) {
      return res.status(404).json({ message: "Patient introuvable." });
    }

    // Vérification des examens valides
    const examNames = exams.map((e) => e.examinationName);
    const examTypes = await ExaminationType.find({
      examinationName: { $in: examNames },
      isActive: true,
    });

    const validNames = examTypes.map((e) => e.examinationName);
    const invalidNames = examNames.filter((name) => !validNames.includes(name));

    if (invalidNames.length > 0) {
      return res.status(400).json({
        message: "Examens inactifs ou introuvables.",
        invalidNames,
      });
    }

    // Génération des examens demandés
    const requestedExaminations = exams.map((exam) => {
      const type = examTypes.find(
        (et) => et.examinationName === exam.examinationName
      );

      if (!type) {
        throw new Error(
          `Type d'examen introuvable pour ${exam.examinationName}`
        );
      }

      const payment = exam.paymentInfo;
      if (!payment || !payment.paymentType) {
        throw new Error(
          `Type de paiement manquant pour ${exam.examinationName}`
        );
      }

      if (payment.paymentType === "Cash" && !payment.amountPaid) {
        throw new Error(
          `Montant manquant pour un paiement en espèces sur ${exam.examinationName}`
        );
      }

      return {
        examinationTypeId: type._id,
        examinationName: type.examinationName,
        isCollected: false,
        examinationStatus: "Pending",
        quantity: 1,
        payment: {
          amountPaid: payment.amountPaid || 0,
          paymentType: payment.paymentType,
          paymentMethod: payment.paymentMethod || "N/A",
          receiptNumber: payment.receiptNumber || "",
          paidBy: payment.paidBy || "",
          paymentDetails: {
            insurerName: payment.insurerName || "",
            contractNumber: payment.contractNumber || "",
            doctorName: payment.doctorName || "",
            reasonForFree: payment.reasonForFree || "",
            authorizedByUserName: payment.authorizedByUserName || "",
          },
        },
      };
    });

    // Création de la demande
    const request = new AnalysisRequest({
      patientId: patient._id,
      requestDate: new Date(),
      status: "Pending",
      requestedByUserId: userId || null,
      requestedExaminations,
      internalNotes: "Créée depuis le module accueil",
    });

    await request.save();

    await logAction({
      user: userId,
      action: "Création d'une demande d'examen avec paiements individuels",
      details: `Patient: ${patient.lastName} ${patient.firstName} (Code: ${
        patient.anonymizedCode
      }), Examens: ${examNames.join(", ")}`,
      ip,
    });

    return res.status(201).json({
      message: "Demande d'examen enregistrée avec succès.",
      requestId: request._id,
    });
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    await logAction({
      user: userId,
      action: "Erreur lors de la création d'une demande",
      details: error.message,
      ip,
    });
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

const getAllExams = async (req, res) => {
  try {
    const exams = await ExaminationType.find(
      {},
      "-creationDate -resultDelay -__v -isActive"
    ); // Exclure le mot de passe
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const getDailyStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [totalPatientsOfDay, totalExamsOfDay] = await Promise.all([
      Patient.countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      }),

      AnalysisRequest.aggregate([
        {
          $match: { requestDate: { $gte: todayStart, $lte: todayEnd } },
        },
        {
          $project: {
            count: { $size: "$requestedExaminations" },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$count" },
          },
        },
      ]).then((res) => res[0]?.total || 0),
    ]);

    return res.status(200).json({
      totalPatientsOfDay,
      totalExamsOfDay,
      totalResultsOfDay: 0, // À implémenter plus tard
      totalAppointmentsOfDay: 0, // À implémenter plus tard
    });
  } catch (error) {
    console.error("Erreur getDailyStats :", error);
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = {
  newPatient,
  newExamination,
  getAllExams,
  getDailyStats,
};
