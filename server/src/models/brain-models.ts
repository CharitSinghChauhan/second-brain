import mongoose, { Schema } from "mongoose";
import type { IBrain } from "../types/types.js";

const brainSchema = new Schema<IBrain>(
  {
    shareableLink: { type: String, require: true },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Brain = mongoose.model("Brain", brainSchema);
