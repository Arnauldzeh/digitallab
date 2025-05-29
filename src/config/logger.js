const Log = require("../models/log");

const logAction = async ({ user, action, details, ip }) => {
  try {
    const logEntry = new Log({ user, action, details, ip });
    await logEntry.save();
    console.log(`📝 [LOG] ${new Date().toLocaleString()} - ${action}`);
  } catch (error) {
    console.error("❌ Erreur de journalisation :", error);
  }
};

module.exports = logAction;
