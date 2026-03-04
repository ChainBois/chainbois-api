const crypto = require("crypto");

const validateCryptoEnv = function () {
  if (!process.env.KEY || !process.env.ALGORITHM) {
    throw new Error("Encryption KEY and ALGORITHM must be set in environment variables");
  }
  const keyBuf = Buffer.from(process.env.KEY, "hex");
  if (keyBuf.length !== 32) {
    throw new Error(`Encryption KEY must be 64 hex chars (32 bytes for AES-256). Got ${process.env.KEY.length} chars.`);
  }
};

const encrypt = (text) => {
  return new Promise((resolve, reject) => {
    try {
      const iv = crypto.randomBytes(16);
      const key = Buffer.from(process.env.KEY, "hex");
      const cipher = crypto.createCipheriv(
        process.env.ALGORITHM,
        key,
        iv
      );
      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");
      const iv64 = Buffer.from(iv, "binary").toString("base64");
      resolve({
        iv: iv64,
        data: encrypted,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const decrypt = (text, iv64) => {
  return new Promise((resolve, reject) => {
    try {
      const iv = Buffer.from(iv64, "base64");
      const key = Buffer.from(process.env.KEY, "hex");
      const decipher = crypto.createDecipheriv(
        process.env.ALGORITHM,
        key,
        iv
      );
      let decrypted = decipher.update(text, "hex", "utf8");
      decrypted += decipher.final("utf8");
      resolve(decrypted);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  encrypt,
  decrypt,
  validateCryptoEnv,
};
