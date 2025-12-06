import express from "express";
import { body } from "express-validator";
import { signUp, signIn } from "../controllers/AuthenticationController.js";

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
  signUp
);
router.post(
  "/signin",
  [
    body("usernameOrEmail")
      .notEmpty()
      .withMessage("Please enter a username or email"),

    body("password").notEmpty().withMessage("password is required"),
  ],
  signIn
);

export default router;
