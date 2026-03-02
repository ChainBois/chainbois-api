const crypto = require("crypto");

const encrypt = (text) => {
  return new Promise((resolve, reject) => {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        process.env.ALGORITHM,
        process.env.KEY,
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
      const decipher = crypto.createDecipheriv(
        process.env.ALGORITHM,
        process.env.KEY,
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
};
