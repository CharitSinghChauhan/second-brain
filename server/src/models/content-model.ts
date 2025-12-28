import mongoose, { Model, Schema } from "mongoose";
import type { IContent } from "../types/types.js";

const contentSchema = new Schema<IContent>(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    contentLink: { type: String },
    brainId: { type: mongoose.Schema.Types.ObjectId },
    type: {
      type: String,
      required: true,
      enum: [
        "video",
        "article",
        "tweet",
        "document",
        "image",
        "audio",
        "link",
        "note",
      ],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast user content lookup
contentSchema.index({ userId: 1 });
// Compound index for user content sorted by creation date
contentSchema.index({ userId: 1, createdAt: -1 });

export const Content: Model<IContent> = mongoose.model<IContent>(
  "Content",
  contentSchema
);
