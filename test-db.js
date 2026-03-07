import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.test" });

console.log("Testing database connection...");
console.log("MONGO_URI:", process.env.MONGO_URI);

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Database connected successfully!");
  await mongoose.connection.close();
  console.log("✅ Database connection closed.");
} catch (error) {
  console.error("❌ Database connection failed:", error.message);
  process.exit(1);
}