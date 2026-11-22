import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { decryptCEK } from "../utils/crypto-utils.js";
import { getLocalDB } from "../utils/local-db.js";
import mongoose from "mongoose";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false,
        message: "No token provided" 
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;
    let encryptedCEK, cekIv, cekAuthTag;

    if (mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: "User not found" 
        });
      }
      encryptedCEK = user.encryptedCEK;
      cekIv = user.cekIv;
      cekAuthTag = user.cekAuthTag;
    } else {
      const db = getLocalDB();
      user = db.users.find(u => u._id === decoded.userId);
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: "User not found" 
        });
      }
      encryptedCEK = Buffer.from(user.encryptedCEK, "base64");
      cekIv = Buffer.from(user.cekIv, "base64");
      cekAuthTag = Buffer.from(user.cekAuthTag, "base64");
    }

    const masterKey = Buffer.from(process.env.MASTER_KEY, "hex");
    const cek = decryptCEK(masterKey, encryptedCEK, cekIv, cekAuthTag);

    req.user = user;
    req.cek = cek;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ 
      success: false,
      message: "Invalid or expired token" 
    });
  }
};
