const Appointment = require("../models/appointment");
const Patient = require("../models/patient");
const logAction = require("../config/logger");

const newAppointment = async (req, res) => {
  try {
    const { patientId, examens } = req.body;

    // Vérification de la présence du patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient introuvable" });
    }

    // Nettoyage des examens (garder uniquement les champs nécessaires)
    const cleanedExamens = (examens || []).map((exam) => ({
      examinationName: exam.examinationName,
      motif: exam.motif,
      dateRDV: exam.dateRDV,
      heureRDV: exam.heureRDV,
      statut: exam.statut || "En attente",
    }));

    // Création du rendez-vous
    const appointment = new Appointment({
      patientId,
      examens: cleanedExamens,
    });

    await appointment.save();

    return res.status(201).json({
      message: "Rendez-vous créé avec succès",
      appointment,
    });
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  newAppointment,
};
