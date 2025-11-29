// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URL = process.env.URL;

const connectDB = async () => {
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB; // 👈 this line fixes your error
