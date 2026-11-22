import Entry from "../models/entry.model.js";
import { encryptText, decryptText } from "../utils/crypto-utils.js";
import { getLocalDB, saveLocalDB } from "../utils/local-db.js";
import crypto from "crypto";
import mongoose from "mongoose";

export const createEntry = async (req, res) => {
  try {
    const { title, text, category, tags, mood, color, favorite } = req.body;

    if (!title || !text) {
      return res.status(400).json({ 
        success: false,
        message: "Title and text are required" 
      });
    }

    const { encrypted, iv, authTag } = encryptText(req.cek, text);
    const userId = req.user._id.toString();

    let entryObj = null;

    if (mongoose.connection.readyState === 1) {
      const entry = await Entry.create({
        user: req.user._id,
        title,
        encryptedText: encrypted,
        textIv: iv,
        textAuthTag: authTag,
        category: category || "personal",
        tags: Array.isArray(tags) ? tags : [],
        mood: mood || "neutral",
        color: color || "#667eea",
        favorite: Boolean(favorite)
      });
      entryObj = {
        id: entry._id,
        _id: entry._id,
        title: entry.title,
        tags: entry.tags,
        category: entry.category,
        mood: entry.mood,
        color: entry.color,
        favorite: entry.favorite,
        createdAt: entry.createdAt
      };
    } else {
      const db = getLocalDB();
      const newEntry = {
        _id: crypto.randomUUID(),
        user: userId,
        title,
        encryptedText: encrypted.toString("base64"),
        textIv: iv.toString("base64"),
        textAuthTag: authTag.toString("base64"),
        category: category || "personal",
        tags: Array.isArray(tags) ? tags : [],
        mood: mood || "neutral",
        color: color || "#667eea",
        favorite: Boolean(favorite),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      db.entries.push(newEntry);
      saveLocalDB(db);

      entryObj = {
        id: newEntry._id,
        _id: newEntry._id,
        title: newEntry.title,
        tags: newEntry.tags,
        category: newEntry.category,
        mood: newEntry.mood,
        color: newEntry.color,
        favorite: newEntry.favorite,
        createdAt: newEntry.createdAt
      };
    }

    res.status(201).json(entryObj);
  } catch (error) {
    console.error("Create entry error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error creating entry" 
    });
  }
};

export const listEntries = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      const query = { user: req.user._id };

      if (req.query.tag) {
        query.tags = { $in: [new RegExp(req.query.tag, "i")] };
      }
      if (req.query.category) {
        query.category = req.query.category;
      }
      if (req.query.mood) {
        query.mood = req.query.mood;
      }
      if (req.query.favorite === "true") {
        query.favorite = true;
      }
      if (req.query.startDate || req.query.endDate) {
        query.createdAt = {};
        if (req.query.startDate) {
          query.createdAt.$gte = new Date(req.query.startDate);
        }
        if (req.query.endDate) {
          const end = new Date(req.query.endDate);
          end.setHours(23, 59, 59, 999);
          query.createdAt.$lte = end;
        }
      }

      const entries = await Entry.find(query).sort({ createdAt: -1 });

      const formatted = entries.map(e => ({
        _id: e._id,
        id: e._id,
        title: e.title,
        tags: e.tags,
        category: e.category,
        mood: e.mood,
        color: e.color,
        favorite: e.favorite,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt
      }));

      return res.json(formatted);
    } else {
      const db = getLocalDB();
      let entries = db.entries.filter(e => e.user === userId);

      if (req.query.tag) {
        const lowerTag = req.query.tag.toLowerCase();
        entries = entries.filter(e => e.tags && e.tags.some(t => t.toLowerCase().includes(lowerTag)));
      }
      if (req.query.category) {
        entries = entries.filter(e => e.category === req.query.category);
      }
      if (req.query.mood) {
        entries = entries.filter(e => e.mood === req.query.mood);
      }
      if (req.query.favorite === "true") {
        entries = entries.filter(e => e.favorite === true);
      }
      if (req.query.startDate) {
        const start = new Date(req.query.startDate);
        entries = entries.filter(e => new Date(e.createdAt) >= start);
      }
      if (req.query.endDate) {
        const end = new Date(req.query.endDate);
        end.setHours(23, 59, 59, 999);
        entries = entries.filter(e => new Date(e.createdAt) <= end);
      }

      entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const formatted = entries.map(e => ({
        _id: e._id,
        id: e._id,
        title: e.title,
        tags: e.tags,
        category: e.category,
        mood: e.mood,
        color: e.color,
        favorite: e.favorite,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt
      }));

      return res.json(formatted);
    }
  } catch (error) {
    console.error("List entries error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error fetching entries" 
    });
  }
};

export const getEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    let entry = null;
    let text = "";

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid entry ID" });
      }

      entry = await Entry.findOne({ _id: id, user: req.user._id });
      if (!entry) {
        return res.status(404).json({ success: false, message: "Entry not found" });
      }

      text = entry.text || "";
      if (entry.encryptedText && entry.textIv && entry.textAuthTag) {
        try {
          text = decryptText(req.cek, entry.encryptedText, entry.textIv, entry.textAuthTag);
        } catch (err) {
          console.error("Decryption error:", err.message);
        }
      }
    } else {
      const db = getLocalDB();
      entry = db.entries.find(e => e._id === id && e.user === userId);
      if (!entry) {
        return res.status(404).json({ success: false, message: "Entry not found" });
      }

      text = entry.text || "";
      if (entry.encryptedText && entry.textIv && entry.textAuthTag) {
        try {
          text = decryptText(
            req.cek,
            Buffer.from(entry.encryptedText, "base64"),
            Buffer.from(entry.textIv, "base64"),
            Buffer.from(entry.textAuthTag, "base64")
          );
        } catch (err) {
          console.error("Decryption error:", err.message);
        }
      }
    }

    res.json({ 
      _id: entry._id,
      id: entry._id,
      title: entry.title,
      text,
      tags: entry.tags,
      category: entry.category,
      mood: entry.mood,
      color: entry.color,
      favorite: entry.favorite,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt
    });
  } catch (error) {
    console.error("Get entry error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error fetching entry" 
    });
  }
};

export const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text, category, tags, mood, color, favorite } = req.body;
    const userId = req.user._id.toString();

    let updated = null;

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid entry ID" });
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
      if (category !== undefined) updateData.category = category;
      if (mood !== undefined) updateData.mood = mood;
      if (color !== undefined) updateData.color = color;
      if (favorite !== undefined) updateData.favorite = Boolean(favorite);

      if (text !== undefined) {
        const { encrypted, iv, authTag } = encryptText(req.cek, text);
        updateData.encryptedText = encrypted;
        updateData.textIv = iv;
        updateData.textAuthTag = authTag;
      }

      const entry = await Entry.findOneAndUpdate(
        { _id: id, user: req.user._id },
        updateData,
        { new: true, runValidators: true }
      );

      if (!entry) {
        return res.status(404).json({ success: false, message: "Entry not found" });
      }

      updated = {
        _id: entry._id,
        id: entry._id,
        title: entry.title,
        text: text !== undefined ? text : entry.text,
        tags: entry.tags,
        category: entry.category,
        mood: entry.mood,
        color: entry.color,
        favorite: entry.favorite,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt
      };
    } else {
      const db = getLocalDB();
      const entry = db.entries.find(e => e._id === id && e.user === userId);
      if (!entry) {
        return res.status(404).json({ success: false, message: "Entry not found" });
      }

      if (title !== undefined) entry.title = title;
      if (tags !== undefined) entry.tags = Array.isArray(tags) ? tags : [];
      if (category !== undefined) entry.category = category;
      if (mood !== undefined) entry.mood = mood;
      if (color !== undefined) entry.color = color;
      if (favorite !== undefined) entry.favorite = Boolean(favorite);

      if (text !== undefined) {
        const { encrypted, iv, authTag } = encryptText(req.cek, text);
        entry.encryptedText = encrypted.toString("base64");
        entry.textIv = iv.toString("base64");
        entry.textAuthTag = authTag.toString("base64");
      }

      entry.updatedAt = new Date().toISOString();
      saveLocalDB(db);

      updated = {
        _id: entry._id,
        id: entry._id,
        title: entry.title,
        text: text !== undefined ? text : entry.text,
        tags: entry.tags,
        category: entry.category,
        mood: entry.mood,
        color: entry.color,
        favorite: entry.favorite,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt
      };
    }

    res.json(updated);
  } catch (error) {
    console.error("Update entry error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error updating entry" 
    });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid entry ID" });
      }

      const entry = await Entry.findOneAndDelete({ 
        _id: id, 
        user: req.user._id 
      });

      if (!entry) {
        return res.status(404).json({ success: false, message: "Entry not found" });
      }

      res.json({ 
        success: true,
        message: "Entry deleted successfully",
        id: entry._id
      });
    } else {
      const db = getLocalDB();
      const index = db.entries.findIndex(e => e._id === id && e.user === userId);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Entry not found" });
      }

      db.entries.splice(index, 1);
      saveLocalDB(db);

      res.json({ 
        success: true,
        message: "Entry deleted successfully",
        id
      });
    }
  } catch (error) {
    console.error("Delete entry error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error deleting entry" 
    });
  }
};
