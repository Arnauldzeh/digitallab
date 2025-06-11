const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  // console.log("Mot de passe reçu pour le hachage:", motDePasse);
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
