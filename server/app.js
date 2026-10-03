import express from "express";
import { initSocket } from "./socket.js";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import { generateToken } from "./services/generateToken.js";
import { connectDB } from "./config/database/db.js";

import authRoutes from "./routes/authRoute.js";
import teamRoutes from "./routes/teamRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import userRoutes from "./routes/userRoute.js";

import "./config/googleAuth.js";

dotenv.config();

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://hub-one-amber.vercel.app",
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  return (
    allowedOrigins.includes(origin) ||
    /^https:\/\/hub-.*\.vercel\.app$/.test(origin)
  );
};

app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Routes
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(passport.initialize());

const port = process.env.PORT || 3000;

connectDB();

app.use("/api", authRoutes);
app.use("/api/teams", teamRoutes);

// Google OAuth
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    session: false,
  }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "https://hub-one-amber.vercel.app/login",
  }),
  (req, res) => {
    const token = generateToken(req.user);

    const user = {
      _id: req.user._id,
      email: req.user.email,
      username: req.user.username,
    };

    res.redirect(
      `https://hub-one-amber.vercel.app/?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user),
      )}`,
    );
  },
);

const server = app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

initSocket(server, isAllowedOrigin);
