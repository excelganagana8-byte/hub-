import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectUrl = process.env.MONGO_URI;
const client = new MongoClient(connectUrl);

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("Database connected successfully");
  } catch (err) {
    console.log("Connection failed", err);
  }
};
