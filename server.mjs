import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.mjs";
import app from "./app.mjs";

const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Landing Page: http://localhost:${PORT}`);
  console.log(`📔 Diary App:    http://localhost:${PORT}/diary`);
  console.log(`🔌 Health Check: http://localhost:${PORT}/health`);
});
