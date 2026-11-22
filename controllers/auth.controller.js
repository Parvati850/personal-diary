import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { encryptCEK } from "../utils/crypto-utils.js";
import { getLocalDB, saveLocalDB } from "../utils/local-db.js";
import crypto from "crypto";
import mongoose from "mongoose";

export const register = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    } else {
      const db = getLocalDB();
      const existing = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (existing) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate per-user CEK and encrypt with master key
    const CEK = crypto.randomBytes(32);
    const masterKey = Buffer.from(process.env.MASTER_KEY, "hex");
    const { encrypted, iv, authTag } = encryptCEK(masterKey, CEK);

    if (mongoose.connection.readyState === 1) {
      const newUser = new User({
        email: normalizedEmail,
        passwordHash,
        encryptedCEK: encrypted,
        cekIv: iv,
        cekAuthTag: authTag,
      });
      await newUser.save();
    } else {
      const db = getLocalDB();
      const newUser = {
        _id: crypto.randomUUID(),
        email: normalizedEmail,
        passwordHash,
        encryptedCEK: encrypted.toString("base64"),
        cekIv: iv.toString("base64"),
        cekAuthTag: authTag.toString("base64"),
        createdAt: new Date().toISOString()
      };
      db.users.push(newUser);
      saveLocalDB(db);
    }
    
    res.status(201).json({ 
      message: "User registered successfully",
      data: { email: normalizedEmail }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  
  try {
    const normalizedEmail = email.trim().toLowerCase();
    let user = null;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      const db = getLocalDB();
      user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
