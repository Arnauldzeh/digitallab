const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const secretKey = crypto
  .createHash("sha256")
  .update(String(process.env.SECRET_KEY))
  .digest(); // 32 bytes for aes-256
const ivLength = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text) {
  if (!text || typeof text !== "string" || !text.includes(":")) {
    throw new Error("Format de chiffrement invalide.");
  }

  const [ivHex, encryptedData] = text.split(":");

  if (!ivHex || !encryptedData || ivHex.length !== ivLength * 2) {
    throw new Error("Vecteur d'initialisation invalide.");
  }

  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = { encrypt, decrypt };
