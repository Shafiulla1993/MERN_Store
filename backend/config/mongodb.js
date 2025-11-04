import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  await mongoose.connect(`${process.env.MONGODB_URI}`);
};

mongoose.connection.on("disconnected", () =>
  console.log("MongoDB disconnected")
);
process.on("SIGINT", () => mongoose.connection.close(() => process.exit(0)));

export default connectDB;
