import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// ensure JWT secret for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret_key_12345";

let mongoServer;

// Start in-memory MongoDB server before running tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  try {
    await mongoose.connect(uri);
    console.log("In-memory test database connected");
  } catch (error) {
    console.error("Failed to connect to in-memory database:", error);
    process.exit(1);
  }
});

// Disconnect and stop server after tests
afterAll(async () => {
  try {
    await mongoose.connection.close();
    await mongoServer.stop();
    console.log("In-memory test database disconnected");
  } catch (error) {
    console.error("Failed to stop in-memory database:", error);
    process.exit(1);
  }
});

// Clear collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});