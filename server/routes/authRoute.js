import express from "express";
import { body } from "express-validator";
import { signUp } from "../controllers/AuthenticationController.js";

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

export default router;
