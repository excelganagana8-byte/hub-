import mongoose, { Schema } from "mongoose";

const activitySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["message", "team", "file", "task", "meeting"],
      default: "team",
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    teamName: {
      type: String,
      trim: true,
    },
    targetUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
