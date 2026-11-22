import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import entryRoutes from "./routes/entry.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);

// Landing Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "landing.html"));
});

// Diary App
app.get("/diary", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "Connected (MongoDB Atlas)" : "Connected (Local Storage Fallback)",
    message: "Server is running smoothly"
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Route not found" 
  });
});

export default app;
