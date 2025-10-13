import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./config/database/db.js";

const app = express();
dotenv.config();

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
connectDB();
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
