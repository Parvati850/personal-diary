import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("⚠️ MONGO_URI is not set in .env");
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`⚠️ MongoDB Connection Error: ${err.message}`);
    console.warn("💡 Tip: If using MongoDB Atlas, make sure your cluster is resumed/active and IP is whitelisted (https://cloud.mongodb.com), or update MONGO_URI in .env.");
  }
};
