import mongoose, { Schema } from "mongoose";

const VerificationPinSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    pin: {
      type: String,
      required: true,
    },

    expires_in: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const VerificationPin = mongoose.model(
  "VerificationPin",
  VerificationPinSchema
);
export default VerificationPin;
