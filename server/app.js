import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./config/database/db.js";
import authRoutes from "./routes/authRoute.js";

const app = express();
dotenv.config();

//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

connectDB();
app.use("/api", authRoutes);
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
