const crypto = require("crypto");

// Set up test env vars before requiring the module
const testKey = crypto.randomBytes(32).toString("hex"); // 64 hex chars
process.env.KEY = testKey;
process.env.ALGORITHM = "aes-256-cbc";

const { encrypt, decrypt, validateCryptoEnv } = require("../utils/cryptUtils");

describe("validateCryptoEnv", () => {
  test("does not throw with valid KEY and ALGORITHM", () => {
    expect(() => validateCryptoEnv()).not.toThrow();
  });

  test("throws when KEY is missing", () => {
    const originalKey = process.env.KEY;
    delete process.env.KEY;
    expect(() => validateCryptoEnv()).toThrow("Encryption KEY and ALGORITHM must be set");
    process.env.KEY = originalKey;
  });

  test("throws when ALGORITHM is missing", () => {
    const originalAlgo = process.env.ALGORITHM;
    delete process.env.ALGORITHM;
    expect(() => validateCryptoEnv()).toThrow("Encryption KEY and ALGORITHM must be set");
    process.env.ALGORITHM = originalAlgo;
  });

  test("throws when KEY is wrong length", () => {
    const originalKey = process.env.KEY;
    process.env.KEY = "abcdef"; // too short
    expect(() => validateCryptoEnv()).toThrow("64 hex chars");
    process.env.KEY = originalKey;
  });
});

describe("encrypt", () => {
  test("encrypts a string and returns iv and data", async () => {
    const result = await encrypt("hello world");
    expect(result).toHaveProperty("iv");
    expect(result).toHaveProperty("data");
    expect(typeof result.iv).toBe("string");
    expect(typeof result.data).toBe("string");
    expect(result.iv.length).toBeGreaterThan(0);
    expect(result.data.length).toBeGreaterThan(0);
  });

  test("produces different ciphertexts for same input (random IV)", async () => {
    const result1 = await encrypt("test");
    const result2 = await encrypt("test");
    expect(result1.iv).not.toBe(result2.iv);
    expect(result1.data).not.toBe(result2.data);
  });

  test("encrypts empty string", async () => {
    const result = await encrypt("");
    expect(result).toHaveProperty("iv");
    expect(result).toHaveProperty("data");
  });

  test("encrypts long strings", async () => {
    const longString = "a".repeat(10000);
    const result = await encrypt(longString);
    expect(result.data.length).toBeGreaterThan(0);
  });

  test("encrypts special characters", async () => {
    const result = await encrypt("!@#$%^&*()_+{}|:<>?日本語");
    expect(result).toHaveProperty("data");
  });
});

describe("decrypt", () => {
  test("decrypts encrypted text correctly", async () => {
    const plaintext = "hello world";
    const encrypted = await encrypt(plaintext);
    const decrypted = await decrypt(encrypted.data, encrypted.iv);
    expect(decrypted).toBe(plaintext);
  });

  test("round-trips various strings", async () => {
    const testStrings = [
      "simple text",
      "0x1234567890abcdef",
      '{"key": "value"}',
      "line1\nline2\ttab",
      "Unicode: é ñ ü 日本語",
      "",
      "a".repeat(5000),
    ];

    for (const str of testStrings) {
      const encrypted = await encrypt(str);
      const decrypted = await decrypt(encrypted.data, encrypted.iv);
      expect(decrypted).toBe(str);
    }
  });

  test("rejects with wrong IV", async () => {
    const encrypted = await encrypt("test");
    const wrongIv = Buffer.from(crypto.randomBytes(16)).toString("base64");
    // Wrong IV should either produce garbage or throw
    try {
      const decrypted = await decrypt(encrypted.data, wrongIv);
      // If it doesn't throw, it should produce different output
      expect(decrypted).not.toBe("test");
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  test("rejects with invalid ciphertext", async () => {
    const fakeIv = Buffer.from(crypto.randomBytes(16)).toString("base64");
    await expect(decrypt("invalidhexdata", fakeIv)).rejects.toThrow();
  });
});
