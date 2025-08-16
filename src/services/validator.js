// services/validator.js
const { body } = require("express-validator");

const userValidationRules = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required.")
    .isAlpha("fr-FR", { ignore: " -" })
    .withMessage("Only letters allowed."),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required.")
    .isAlpha("fr-FR", { ignore: " -" })
    .withMessage("Only letters allowed in last Name."),

  body("qualification")
    .trim()
    .notEmpty()
    .withMessage("Qualification is required."),

  body("department").trim().notEmpty().withMessage("Department is required."),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .matches(/^[6-9][0-9]{8}$/)
    .withMessage("Phone number must be 9 digits."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format.")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Minimum 6 characters."),
];

const patientValidationRules = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required.")
    .isAlpha("fr-FR", { ignore: " -" }),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required.")
    .isAlpha("fr-FR", { ignore: " -" }),

  body("gender")
    .trim()
    .notEmpty()
    .withMessage("Gender is required.")
    .isIn(["Homme", "Femme", "F", "M"])
    .withMessage("Gender must be 'Homme' or 'Femme'."),

  body("birthDate")
    .notEmpty()
    .withMessage("Birth date is required.")
    .isISO8601()
    .toDate()
    .withMessage("Invalid birth date format."),

  body("phoneNumber")
    .optional()
    .matches(/^[6-9][0-9]{8}$/)
    .withMessage("Invalid phone number."),
];

module.exports = {
  userValidationRules,
  patientValidationRules,
};
