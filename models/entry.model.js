import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  text: {
    type: String
  },
  encryptedText: Buffer,
  textIv: Buffer,
  textAuthTag: Buffer,
  category: {
    type: String,
    default: "personal"
  },
  tags: [{
    type: String,
    trim: true
  }],
  mood: {
    type: String,
    default: "neutral"
  },
  color: {
    type: String,
    default: "#667eea"
  },
  favorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model("Entry", entrySchema);
