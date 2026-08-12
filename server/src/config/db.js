const mongoose = require("mongoose");

const DEFAULT_ATLAS_SRV =
  "mongodb+srv://ndsf999_db_user:bq8uTXpYuuuLfAhe@cluster0.vptojr2.mongodb.net/opportunity_bridge?retryWrites=true&w=majority&appName=Cluster0";

let memoryServer = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || DEFAULT_ATLAS_SRV;

    const isPlaceholder =
      !mongoUri ||
      mongoUri.includes("yourUsername") ||
      mongoUri.includes("user:password") ||
      mongoUri.includes("xxxxx");

    if (isPlaceholder) {
      mongoUri = DEFAULT_ATLAS_SRV;
    }

    try {
      // Primary Attempt: SRV URI with IPv4 forced
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        family: 4,
      });
      console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    } catch (primaryErr) {
      console.warn(`[Database Warning] MongoDB Atlas connection failed (${primaryErr.message}). IP may not be whitelisted.`);
      
      // Fallback: In-Memory MongoDB for local offline testing if Atlas IP is blocked
      try {
        console.log("[Database] Initializing In-Memory Fallback MongoDB for offline team testing...");
        const { MongoMemoryServer } = require("mongodb-memory-server");
        memoryServer = await MongoMemoryServer.create();
        const fallbackUri = memoryServer.getUri();
        const conn = await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`[Database] In-Memory Fallback MongoDB Connected: ${conn.connection.host}`);
      } catch (memErr) {
        console.error(`[Database Error] Fallback memory server error: ${memErr.message}`);
        mongoose.set("bufferCommands", false);
      }
    }
  } catch (error) {
    console.error(`[Database Error] Connection handler error: ${error.message}`);
  }
};

module.exports = connectDB;
