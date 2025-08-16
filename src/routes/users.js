const express = require("express");
const router = express.Router();
const {
  signin,
  newUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  getAllPatientsExams,
  getAllPatients,
  updatePatient,
  resetPassword,
  getUserStatistics,
} = require("../controllers/users");
const {
  newPatient,
  newExamination,
  getAllExams,
  getDailyStats,
} = require("../controllers/accueil");
const { newAppointment } = require("../controllers/appointment");
const {
  newSample,
  getRejectedExams,
  rejectRequestedExamination,
} = require("../controllers/sampling");

const { authorizeRoles, authenticate } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  patientValidationRules,
  userValidationRules,
} = require("../services/validator");

//Patient
router.post("/signin", signin);
router.get(
  "/examination",
  authenticate,
  authorizeRoles("Admin", "Accueil"),
  getAllExams
);
router.get(
  "/patient/examinations",
  authenticate,
  authorizeRoles("Admin", "Accueil"),
  getAllPatientsExams
);
router.post(
  "/patient/new",
  authenticate,
  authorizeRoles("Admin", "Accueil"),
  patientValidationRules,
  validate,
  newPatient
);
router.put(
  "/patient/:anonymizedCode",
  authenticate,
  authorizeRoles("Admin", "Accueil"),
  updatePatient
);
router.get("/patient/stats", getDailyStats);
router.get("/patient", getAllPatients);

////USERS
router.get("/stats", getUserStatistics);
router.get("/", authenticate, authorizeRoles("Admin"), getUsers);
router.get("/:id", authenticate, authorizeRoles("Admin"), getUserById);
router.post(
  "/register",
  authenticate,
  authorizeRoles("Admin"),
  userValidationRules,
  validate,
  newUser
);
router.delete("/:id", authenticate, authorizeRoles("Admin"), deleteUser);
router.patch("/:id", authenticate, updateUser);
router.post("/examination/new", authenticate, newExamination);

router.patch(
  "/reset-password/:id",
  authenticate,
  authorizeRoles("Admin"),
  resetPassword
);

//Rendez-vous
router.patch("/analysis/:id", rejectRequestedExamination);
router.get("/analysis/rejected", getRejectedExams);
router.post("/appointment", newAppointment);

//Prélèvement
router.post("/samples/new", newSample);
router.get("/");
router.get("/:id");
router.put("/:id");
router.delete("/:id");
module.exports = router;
