const bcrypt = require("bcrypt");

const hashPassword = async (motDePasse) => {
  // console.log("Mot de passe reçu pour le hachage:", motDePasse);
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(motDePasse, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
