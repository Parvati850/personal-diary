import express from "express";
import { auth } from "../middleware/auth-middleware.js";
import { createEntry, listEntries, getEntry, updateEntry, deleteEntry } from "../controllers/entry.controller.js";

const router = express.Router();

router.post("/", auth, createEntry);
router.get("/", auth, listEntries);
router.get("/:id", auth, getEntry);
router.put("/:id", auth, updateEntry);
router.delete("/:id", auth, deleteEntry);

export default router;
