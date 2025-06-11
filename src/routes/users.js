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
  updatePatient,
} = require("../controllers/users");
const {
  newPatient,
  newExamination,
  getAllExams,
} = require("../controllers/accueil");

const { authorizeRoles, authenticate } = require("../middleware/auth");

router.post("/signin", signin);

router.get("/examination", authenticate, authorizeRoles("Admin"), getAllExams);
router.get(
  "/patient/examinations",
  authenticate,
  authorizeRoles("Admin"),
  getAllPatientsExams
);

router.get("/", authenticate, authorizeRoles("Admin"), getUsers);
router.get("/:id", authenticate, authorizeRoles("Admin"), getUserById);

router.post("/register", authenticate, authorizeRoles("Admin"), newUser);
router.delete("/:id", authenticate, authorizeRoles("Admin"), deleteUser);
router.patch("/:id", authenticate, authorizeRoles("Admin"), updateUser);
router.post(
  "/patient/new",
  authenticate,
  authorizeRoles("Admin", "Reception"),
  newPatient
);
router.post("/examination/new", newExamination);

router.put(
  "/patient/:anonymizedCode",
  authenticate,
  authorizeRoles("Admin"),
  updatePatient
);
module.exports = router;
