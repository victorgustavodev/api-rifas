import mongoose from "mongoose";

export async function mongoConnect() {
  try {
    mongoose.connect(process.env.ATLAS_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`Error connecting to MongoDB:`);
  }
}
