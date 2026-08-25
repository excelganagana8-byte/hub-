import User from "../models/User.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { generateToken } from "../services/generateToken.js";
import VerificationPin from "../models/VerificationPin.js";
import { generateRef } from "../utils/generateRef.js";

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

    // Generate jwt
    const token = generateToken(user);

    res.status(201).json({
      message: `Hello ${username}!, signup successful`,
      user: { email, username },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//login logic
export const signIn = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((e) => ({
        field: e.param,
        message: e.msg,
      }));
      return res.status(400).json({ errors: formattedErrors });
    }
    //find user by email or username
    const { usernameOrEmail, password } = req.body;

    //Determine if input is an email
    const isEmail = usernameOrEmail.includes("@");

    //check if the user exist
    const existingUser = await User.findOne(
      isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail },
    );
    if (!existingUser)
      return res
        .status(400)
        .json({ message: "No user with this email or username" });

    //check if the hashed password is matched
    const isMatched = await bcrypt.compare(password, existingUser.password);
    if (!isMatched)
      return res.status(400).json({ message: "incorrect password" });

    const token = generateToken(existingUser);

    //create user object
    const user = {
      email: existingUser.email,
      username: existingUser.username,
    };

    res.status(200).json({
      message: `welcome back ${user.username}`,
      data: { user, token },
    });
  } catch (error) {}
};

//verify user logic
export const verifyUser = async (req, res) => {
  try {
    const { email, pin } = req.body;

    //check if user exist
    const user = User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No user found" });

    //check if user is verified
    if (user.isVerified)
      return res.status(400).json({ message: "user already verified" });

    //check the verification pin
    const record = await VerificationPin.findOne({ user: user.id });

    if (!record || record.pin !== pin)
      return res.status(400).json({ message: "Invalid Pin" });

    if (record.expires_in > new Date())
      return res.status(400).json({ message: "Pin expired" });

    //only when all conditions are met and there are o bad messages that is when this part is hit
    user.isVerified = true;
    await user.save();

    //optionally delete used pin
    // await record.deleteOne()
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//send verification pin logic
export const sendVerificationPin = async (req, res) => {
  try {
    const { email } = req.body;
    const pin = generateRef();
    const expires_in = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const verification = await VerificationPin.findOneAndUpdate(
      { user: user.id },
      { pin, expires_in },
      { new: true, upsert: true },
    );

    //TODO: send email/SMS here
    //sendEmail (user.email, `Your verification pin is ${pin}`)

    res.status(200).json({
      message: "Verification Pin Sent",
      data: { pin: verification.pin }, //for testing
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//reset password logic
export const resetPassword = async (req, body) => {
  try {
    const { email, pin, newPasswod } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
  } catch (error) {
    cconsole.error();
  }
};
