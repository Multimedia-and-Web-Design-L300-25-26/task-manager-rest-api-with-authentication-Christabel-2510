import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Set connection timeout
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    // Don't exit in test environment
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

export default connectDB;