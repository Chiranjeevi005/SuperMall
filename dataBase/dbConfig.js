const mongoose = require("mongoose");

let isConnected = false; 

async function connectToDataBase() {
  try {
    if (isConnected) {
      console.log("Using existing MongoDB connection");
      return;
    }

    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URL);

    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      console.error(" MongoDB connection error:", err);
    });

    isConnected = true;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = { connectToDataBase };