import mongoose from "mongoose";

let isConnected = false; // Global flag

const connectDB = async () => {
  if (isConnected) {
    console.log("🔁 Using existing MongoDB connection");
    return;
  }

  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) throw new Error("❌ MONGO_URL not found");

    // Reuse existing connection if mongoose already connected
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      console.log("🔁 MongoDB already connected");
      return;
    }

    // Removed deprecated options - they're default in Mongoose 8.x
    await mongoose.connect(mongoUrl);

    isConnected = true;
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
