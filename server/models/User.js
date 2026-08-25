import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },

    username: {
      type: String,
      trim: true,
      required: true,
    },

    password: {
      type: String,
      minLength: 8,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
