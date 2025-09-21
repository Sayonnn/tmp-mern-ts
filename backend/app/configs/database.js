import mongoose from "mongoose";
import {config} from "./index.js";

const uri = config.db.mongo_uri; 

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
