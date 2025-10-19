import User from "../models/User.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

//register logic
export const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Log to confirm the structure
      console.log("Validation errors:", errors.array());

      const formattedErrors = {};
      errors.array().forEach((err) => {
        // Some versions use "path" instead of "param"
        const field = err.param || err.path;
        formattedErrors[field] = err.msg;
      });

      return res.status(400).json({ errors: formattedErrors });
    }

    const { email, password, username } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username });
    await user.save();

    res.status(201).json({
      message: `Hello ${username}!, signup successful`,
      user: { email, username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//login logic
export const login = () => {};

//verify user logic
export const verifyUser = () => {};

//reset password logic
export const resetPassword = () => {};

//send verification pin logic
export const sendVerificationPin = () => {};
