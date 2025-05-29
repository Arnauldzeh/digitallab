// Fonctionnalitées de l'agentTechnicien
const User = require("../models/users");
const { hashPassword, comparePassword } = require("../services/hash");
const { generateUserId } = require("../services/generateId");
const { generateToken } = require("../services/jwt");
const logAction = require("../config/logger");

const signin = async (req, res, next) => {
  try {
    const { identifiant, motDePasse } = req.body;

    const user = await User.findOne({ identifiant });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed, Wrong credentials" });
    }

    const isMatch = await comparePassword(motDePasse, user.motDePasse);
    if (!isMatch) {
      return res.status(401).json({
        message: "Authentication failed, Wrong credentials",
      });
    }

    const token = generateToken(user);

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const newUser = async (req, res, next) => {
  const { nom, prenom, poste, role, telephone, motDePasse } = req.body;
  const ip = req.ip;
  const userId = req.user ? req.user._id : null;

  try {
    // 🔍 Vérification des champs requis
    if (!nom || !prenom || !poste || !role || !telephone || !motDePasse) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }
    // 🔍 Vérifier si un utilisateur avec le même numéro de téléphone existe déjà
    const isFound = await User.findOne({ telephone });
    if (isFound) {
      await logAction({
        user: userId,
        action:
          "Tentative d'ajout d'un utilisateur avec un numéro déjà utilisé",
        details: `Nom: ${nom} | Prénom: ${prenom} | Téléphone: ${telephone}`,
        ip,
      });
      return res
        .status(400)
        .json({ message: "Un utilisateur possede deja ces identifiants !" });
    }
    // Vérifier si un utilisateur normal tente de créer un admin
    if (role === "admin" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Seuls les administrateurs peuvent créer un admin" });
    }
    // 1️⃣ Génération de l'identifiant unique
    const identifiant = await generateUserId(nom, prenom, poste, role);

    // 2️⃣ Hachage du mot de passe
    const hashedPassword = await hashPassword(motDePasse);

    // 3️⃣ Création du nouvel utilisateur
    const newUser = new User({
      nom,
      prenom,
      identifiant,
      poste,
      role,
      telephone,
      motDePasse: hashedPassword,
    });
    await newUser.save();

    // 4️⃣ Journalisation
    await logAction({
      user: userId,
      action: "Ajout d'un nouvel utilisateur",
      details: `Utilisateur: ${nom} ${prenom} | Grade: ${poste} | Rôle: ${role}`,
      ip,
    });

    res
      .status(201)
      .json({ message: "Utilisateur créé avec succès", identifiant });
  } catch (error) {
    console.error("Erreur serveur:", error);
    await logAction({
      user: userId,
      action: "Erreur lors de l'ajout d'un utilisateur",
      details: error.message,
      ip,
    });
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupérer tous les utilisateurs
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-motDePasse"); // Exclure le mot de passe
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-motDePasse"); // Exclure le mot de passe

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    await User.findByIdAndDelete(id);

    await logAction({
      user: req.user ? req.user._id : null,
      action: "Suppression d'un utilisateur",
      details: `Utilisateur supprimé : ${user.nom} ${user.prenom} | Identifiant: ${user.identifiant}`,
      ip: req.ip,
    });

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Vérifier si on essaie de modifier l'identifiant (ce qui est interdit)
    if (updates.identifiant) {
      return res
        .status(400)
        .json({ message: "Modification de l'identifiant non autorisée" });
    }

    // Vérifier si le numéro de téléphone existe déjà chez un autre utilisateur
    if (updates.telephone) {
      const existingUser = await User.findOne({ telephone: updates.telephone });
      if (existingUser && existingUser._id.toString() !== id) {
        return res
          .status(400)
          .json({ message: "Ce numéro de téléphone est déjà utilisé !" });
      }
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    await logAction({
      user: req.user ? req.user._id : null,
      action: "Modification d'un utilisateur",
      details: `Utilisateur modifié : ${user.nom} ${user.prenom} | Identifiant: ${user.identifiant}`,
      ip: req.ip,
    });

    res.json({ message: "Utilisateur mis à jour avec succès", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

module.exports = {
  signin,
  newUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};
