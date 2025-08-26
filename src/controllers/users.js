const Patient = require("../models/patient");
const AnalysisRequest = require("../models/analysisRequest");
const User = require("../models/users");
const { hashPassword, comparePassword } = require("../services/hash");
const { generateUserId } = require("../services/generateId");
const { generateToken } = require("../services/jwt");
const logAction = require("../config/logger");
const analysisRequest = require("../models/analysisRequest");

const signin = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });
    if (!user) {
      await logAction({
        user: null,
        action: "Failed sign-in attempt",
        details: `User: ${userName} | Reason: Invalid credentials`,
        ip: req.ip,
      });
      return res
        .status(401)
        .json({ message: "Authentication failed: Invalid credentials." });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      await logAction({
        user: null,
        action: "Failed sign-in attempt",
        details: `User: ${userName} | Reason: Invalid credentials`,
        ip: req.ip,
      });
      return res.status(401).json({
        message: "Authentication failed: Invalid credentials.",
      });
    }

    // Vérification si l'utilisateur est bloqué
    if (user.isBlocked) {
      await logAction({
        user: null,
        action: "Failed sign-in attempt",
        details: `User: ${userName} | Reason: User blocked`,
        ip: req.ip,
      });
      return res.status(403).json({
        message:
          "Accès interdit au système, veuillez contacter l'administrateur",
      });
    }

    const token = generateToken(user);

    // RESTful response for successful sign-in
    res.status(200).json({
      message: "Sign-in successful.",
      token,
      user: {
        lastName: user.lastName,
        firstName: user.firstName,
        userName: user.userName,
        qualification: user.qualification,
        departments: user.departments,
        phoneNumber: user.phoneNumber,
        email: user.email,
        isBlocked: user.isBlocked,
      },
    });
    await logAction({
      user: user._id,
      action: "User sign-in",
      details: `User: ${user.userName}`,
      ip: req.ip,
    });
  } catch (error) {
    // Pass error to next middleware for centralized error handling
    next(error);
  }
};

const newUser = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      qualification,
      departments,
      phoneNumber,
      email,
      password,
    } = req.body;

    const ip = req.ip;
    const userId = req.user ? req.user._id : null;

    // ✅ Vérification des champs obligatoires
    if (
      !firstName ||
      !lastName ||
      !qualification ||
      !departments ||
      !phoneNumber ||
      !email ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ S'assurer que departments est toujours un tableau
    const departmentsArray = Array.isArray(departments)
      ? departments
      : [departments];

    // 🔐 Vérifier qu’un admin ne peut être créé que par un admin
    if (
      departmentsArray.includes("Admin") &&
      req.user?.qualification !== "Admin"
    ) {
      return res.status(403).json({
        message: "Only administrators can create an admin user.",
      });
    }

    // 🔢 Vérification unicité du numéro de téléphone (données chiffrées)
    const allUsers = await User.find({});
    const phoneExists = allUsers.find((user) => {
      try {
        return decrypt(user.phoneNumber) === phoneNumber;
      } catch (err) {
        return false;
      }
    });

    if (phoneExists) {
      await logAction({
        user: userId,
        action: "Attempt to add user with existing phone number",
        details: `Name: ${lastName} | First Name: ${firstName} | Phone: ${phoneNumber}`,
        ip,
      });
      return res.status(400).json({
        message: "A user with this phone number already exists.",
      });
    }

    // 🔢 Génération de l'identifiant unique
    const userName = await generateUserId(
      lastName,
      firstName,
      qualification,
      departmentsArray
    );

    // 🔐 Hashage du mot de passe
    const hashedPassword = await hashPassword(password);

    // 📥 Création du nouvel utilisateur
    const newUser = new User({
      firstName,
      lastName,
      qualification,
      departments: departmentsArray,
      phoneNumber,
      email,
      userName,
      password: hashedPassword,
    });

    await newUser.save();

    // 🔔 Log de création
    await logAction({
      user: userId,
      action: "New user added",
      details: `User: ${lastName} ${firstName} | Qualification: ${qualification} | Departments: ${departmentsArray.join(
        ", "
      )}`,
      ip,
    });

    // ✅ Réponse
    res.status(201).json({
      message: "User created successfully.",
      data: { userName: newUser.userName, _id: newUser._id },
    });
  } catch (error) {
    console.error("Server error:", error);
    await logAction({
      user: req.user?._id || null,
      action: "Error adding user",
      details: error.message,
      ip: req.ip,
    });
    next(error);
  }
};
// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find(
      { departments: { $ne: "Admin" } },
      "-password"
    ); // Exclude password
    // RESTful response for successful retrieval of multiple resources
    // // Déchiffre les champs pour chaque patient
    // users.forEach((p) => p.decryptFields());
    res.status(200).json(users);
    await logAction({
      user: req.user?._id,
      action: "Consult user list",
      details: `User list viewed`,
      ip: req.ip,
    });
  } catch (error) {
    next(error); // Pass error to next middleware
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id, "-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // RESTful response for successful retrieval of a single resource

    user.decryptFields();
    res.status(200).json(user);
  } catch (error) {
    next(error); // Pass error to next middleware
  }
};

// Delete a user
const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    await User.findByIdAndDelete(id);

    await logAction({
      user: req.user ? req.user._id : null,
      action: "User deleted",
      details: `Deleted user: ${user.lastName} ${user.firstName} | userName: ${user.userName}`,
      ip: req.ip,
    });

    // RESTful response for successful deletion
    res.status(200).json({ message: "User deleted successfully." });
    // Alternatively, for no content back: res.status(204).send();
  } catch (error) {
    next(error); // Pass error to next middleware
  }
};

// Update a user
const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const updates = { ...req.body };

  try {
    // Check if userName is being modified (which is forbidden)
    if (updates.userName) {
      return res
        .status(400)
        .json({ message: "Modifying 'userName' is not allowed." });
    }

    // Check if the phone number is already used by another user
    if (updates.phoneNumber) {
      const existingUser = await User.findOne({
        phoneNumber: updates.phoneNumber,
      });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({
          message: "This phone number is already in use by another user.",
        });
      }
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await logAction({
      user: req.user ? req.user._id : null,
      action: "User updated",
      details: `Updated user: ${user.lastName} ${user.firstName} | userName: ${user.userName}`,
      ip: req.ip,
    });

    // RESTful response for successful update
    res.status(200).json(user);
  } catch (error) {
    next(error); // Pass error to next middleware
  }
};

const getAllPatientsExams = async (req, res) => {
  try {
    const patients = await Patient.find({});
    // Déchiffre les champs pour chaque patient
    patients.forEach((p) => p.decryptFields());
    const result = await Promise.all(
      patients.map(async (rawPatient) => {
        const patientId = rawPatient._id;

        const patient = {
          anonymizedCode: rawPatient.anonymizedCode,
          lastName: rawPatient.lastName,
          firstName: rawPatient.firstName,
          birthDate: rawPatient.birthDate?.toISOString().split("T")[0],
          gender: rawPatient.gender,
          neighborhood: rawPatient.neighborhood,
          phoneNumber: rawPatient.phoneNumber,
          occupation: rawPatient.occupation,
          email: rawPatient.email,
          departments: rawPatient.departments,
          prescribingDoctor: rawPatient.prescribingDoctor,
        };

        // Récupérer toutes les requêtes de ce patient
        const requests = await analysisRequest
          .find({
            patientId,
            status: { $ne: "Canceled" },
          })
          .sort({ requestDate: -1 })
          .populate("requestedExaminations.examinationTypeId");

        // Rassembler tous les examens avec leur date
        const allExams = [];
        for (const req of requests) {
          for (const exam of req.requestedExaminations) {
            allExams.push({
              name: exam.examinationName,
              date: req.requestDate,
            });
          }
        }

        // Trier tous les examens individuellement par date (les plus récents en premier)
        const sortedExams = allExams
          .sort((a, b) => b.date - a.date)
          .slice(0, 3); // Garder uniquement les 3 plus récents

        // Extraire juste les noms
        const lastExaminations = sortedExams.map((e) => e.name);

        const lastExamDate =
          sortedExams[0]?.date?.toISOString().split("T")[0] || null;
        const lastExamTime =
          sortedExams[0]?.date?.toTimeString().split(" ")[0] || null;

        return {
          patient,
          lastExamDate,
          lastExamTime,
          lastExaminations,
        };
      })
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erreur :", error);
    return res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des examens de tous les patients.",
      error: error.message,
    });
  }
};

const updatePatient = async (req, res, next) => {
  const { anonymizedCode } = req.params;
  const updatedData = { ...req.body };

  try {
    // Check if patient exists
    const existingPatient = await Patient.findOne({ anonymizedCode });
    if (!existingPatient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // If email has changed, check its uniqueness
    if (updatedData.email && updatedData.email !== existingPatient.email) {
      const emailExists = await Patient.findOne({
        email: updatedData.email,
        anonymizedCode: { $ne: anonymizedCode }, // avoid conflict with self
      });

      if (emailExists) {
        return res.status(400).json({
          message: "This email is already in use by another patient.",
        });
      }
    }

    // Perform the update
    const updatedPatient = await Patient.findOneAndUpdate(
      { anonymizedCode },
      updatedData,
      { new: true, runValidators: true }
    ).select("-_id -__v");

    // RESTful response for successful update
    return res.status(200).json({
      updatedPatient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    next(error); // Pass error to next middleware
  }
};

const resetPassword = async (req, res, next) => {
  const { id } = req.params; // ID de l'utilisateur à mettre à jour
  const { newPassword } = req.body;
  const requester = req.user;

  try {
    //Vérification de l'utilisateur actuel (doit être admin)
    if (!requester || requester.departments !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only administrators can reset passwords." });
    }

    console.log("Attempting to reset password for ID:", req.params.id);
    const user = await User.findById(req.params.id);
    // console.log(user);

    // 3. Check if the target user exists
    if (!user) {
      // console.log(`User with ID ${req.params.id} not found.`);
      return res.status(404).json({ message: "User not found." });
    }

    // Récupération de l'utilisateur cible

    // Hash du nouveau mot de passe
    const hashed = await hashPassword(newPassword);
    user.password = hashed;
    await user.save();

    // Journalisation
    await logAction({
      user: requester._id,
      action: "Password reset",
      details: `Password reset for user: ${user.userName} (${user.lastName} ${user.firstName})`,
      ip: req.ip,
    });

    // Réponse RESTful
    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    next(error);
  }
};

const getUserStatistics = async (req, res, next) => {
  try {
    // Récupérer tous les utilisateurs
    const users = await User.find();

    const totalUsers = users.length;

    const blockedUsers = users.filter((user) => user.isBlocked).length;
    const activeUsers = totalUsers - blockedUsers;

    const usersByDepartment = {};
    const usersByQualification = {};

    users.forEach((user) => {
      // Comptage par département
      if (user.departments) {
        usersBydepartment[user.departments] =
          (usersByDepartment[user.departments] || 0) + 1;
      }

      // Comptage par qualification
      if (user.qualification) {
        usersByQualification[user.qualification] =
          (usersByQualification[user.qualification] || 0) + 1;
      }
    });

    return res.status(200).json({
      totalUsers,
      activeUsers,
      blockedUsers,
      usersByDepartment,
      usersByQualification,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find({});
    // Déchiffre les champs pour chaque patient
    patients.forEach((p) => p.decryptFields());
    return res.status(200).json(patients);
  } catch (error) {
    console.error("Erreur :", error);

    return res.status(500).json({
      message: "Erreur serveur lors de la récupération de tous les patients.",
      error: error.message,
    });
  }
};

module.exports = {
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
};
