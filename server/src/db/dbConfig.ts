import mongoose from "mongoose";

export const connectToDB = async () => {
  const mongoose_uri = process.env.MONGODB_URI;

  try {
    if (!mongoose_uri) throw new Error("mongoose_uri error");
    await mongoose.connect(mongoose_uri, {
      dbName: "second-brain",
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log("MongoDB connection error", error);
    process.exit(1);
  }
};
