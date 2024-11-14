import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB connected");
  } catch (error: any) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
