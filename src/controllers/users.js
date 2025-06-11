const Patient = require("../models/Patient");
const ExaminationRequest = require("../models/ExaminationRequest");
const User = require("../models/users");
const { hashPassword, comparePassword } = require("../services/hash");
const { generateUserId } = require("../services/generateId");
const { generateToken } = require("../services/jwt");
const logAction = require("../config/logger");

const signin = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed: Invalid credentials." });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Authentication failed: Invalid credentials.",
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
        department: user.department,
        phoneNumber: user.phoneNumber,
        email: user.email,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    // Pass error to next middleware for centralized error handling
    next(error);
  }
};

const newUser = async (req, res, next) => {
  const {
    firstName,
    lastName,
    qualification,
    department,
    phoneNumber,
    email,
    password,
  } = req.body;
  const ip = req.ip;
  const userId = req.user ? req.user._id : null;

  try {
    // 🔍 Required fields validation
    if (
      !firstName ||
      !lastName ||
      !qualification ||
      !department ||
      !phoneNumber ||
      !email ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 🔍 Check if a user with the same phone number already exists
    const isFound = await User.findOne({ phoneNumber });
    if (isFound) {
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

    // 🔐 Prevent non-admins from creating an admin
    if (department === "Admin" && req.user?.qualification !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only administrators can create an admin user." });
    }

    // 1️⃣ Generate unique identifier (userName)
    const userName = await generateUserId(
      lastName,
      firstName,
      qualification,
      department
    );

    // 2️⃣ Hash the password
    const hashedPassword = await hashPassword(password);

    // 3️⃣ Create the new user
    const newUser = new User({
      firstName,
      lastName,
      qualification,
      department,
      phoneNumber,
      email,
      userName,
      password: hashedPassword,
    });

    await newUser.save();

    // 4️⃣ Log action
    await logAction({
      user: userId,
      action: "New user added",
      details: `user: ${lastName} ${firstName} | qualification: ${qualification} | department: ${department}`,
      ip,
    });

    // RESTful response for successful creation
    res.status(201).json({
      message: "User created successfully.",
      data: { userName: newUser.userName, _id: newUser._id }, // Include key identifiers
    });
  } catch (error) {
    console.error("Server error:", error);
    await logAction({
      user: userId,
      action: "Error adding user",
      details: error.message,
      ip,
    });
    // Pass error to next middleware for centralized error handling
    next(error); // Using next(error) instead of res.status(500) here for consistency
  }
};

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password
    // RESTful response for successful retrieval of multiple resources
    res.status(200).json(users);
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
    res.status(200).json({
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    next(error); // Pass error to next middleware
  }
};

const getAllPatientsExams = async (req, res) => {
  try {
    // 1. Récupérer tous les patients

    const patients = await Patient.find({}); // 2. Traiter chaque patient

    const result = await Promise.all(
      patients.map(async (rawPatient) => {
        const patientId = rawPatient._id; // Construire l'objet patient sans _id, __v, clinicalNote

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

          department: rawPatient.department,

          prescribingDoctor: rawPatient.prescribingDoctor,
        }; // 3. Dernières demandes d’examen

        const requests = await ExaminationRequest.find({
          patientId,

          status: { $ne: "Canceled" },
        })

          .sort({ requestDate: -1 })

          .limit(3)

          .populate("requestedExaminations.examinationTypeId"); // Par défaut

        let lastExamDate = null;

        let lastExamTime = null;

        let lastExaminations = [];

        if (requests.length) {
          const lastRequestDate = requests[0].requestDate;

          lastExamDate = lastRequestDate.toISOString().split("T")[0];

          lastExamTime = lastRequestDate.toTimeString().split(" ")[0];

          lastExaminations = requests.flatMap((req) =>
            req.requestedExaminations.map((exam) => exam.examinationName)
          );
        }

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

module.exports = {
  signin,
  newUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  getAllPatientsExams,
  updatePatient,
};
