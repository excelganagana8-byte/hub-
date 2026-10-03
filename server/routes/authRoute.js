import express from "express";
import { body } from "express-validator";
import {
  signUp,
  signIn,
  refreshToken,
  logout,
} from "../controllers/AuthenticationController.js";
import passport from "passport";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("please enter a valid email"),

    body("username").notEmpty().withMessage("username is required"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("password must be atleast 8 characters"),
  ],
  signUp,
);

router.post(
  "/signin",
  [
    body("usernameOrEmail")
      .notEmpty()
      .withMessage("Please enter a username or email"),

    body("password").notEmpty().withMessage("password is required"),
  ],
  signIn,
);

router.post("/refresh-token", refreshToken);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  async (req, res) => {
    res.redirect("http://localhost:5173");
  },
);
router.post("/logout", logout);
export default router;
