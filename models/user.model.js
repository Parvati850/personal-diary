import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  encryptedCEK: Buffer,
  cekIv: Buffer,
  cekAuthTag: Buffer,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("User", userSchema);
