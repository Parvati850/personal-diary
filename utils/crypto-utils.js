import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

export function encryptCEK(masterKey, cek) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);
  const encrypted = Buffer.concat([cipher.update(cek), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { encrypted, iv, authTag };
}

export function decryptCEK(masterKey, encryptedCEK, iv, authTag) {
  const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encryptedCEK), decipher.final()]);
}

export function encryptText(cek, text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, cek, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { encrypted, iv, authTag };
}

export function decryptText(cek, encrypted, iv, authTag) {
  const decipher = crypto.createDecipheriv(ALGORITHM, cek, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
