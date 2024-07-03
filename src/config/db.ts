import mongoose from "mongoose";

class DatabaseConfig {
  public async connect(URI: string) {
    const options: object = {};
    try {
      await mongoose.connect(URI, options);
      console.log("MongoDB Connected");
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }
  }
}

export default new DatabaseConfig();
