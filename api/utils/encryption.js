import crypto from "crypto";

export const encrypt = (text, key = process.env.ENCRYPTION_KEY) => {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Encryption failed");
  }
};

export const decrypt = (encryptedText, key = process.env.ENCRYPTION_KEY) => {
  try {
    const textParts = encryptedText.split(":");
    const iv = Buffer.from(textParts[0], "hex");
    const encryptedData = textParts[1];

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key),
      iv
    );

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Decryption failed");
  }
};
