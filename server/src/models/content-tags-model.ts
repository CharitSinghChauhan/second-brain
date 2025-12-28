import mongoose, { Schema } from "mongoose";
import type { IContentTags } from "../types/types.js";

const contentTagsSchema = new Schema<IContentTags>(
  {
    contentId: {
      type: Schema.ObjectId,
      required: true,
      ref: "Content",
      index: true,
    },
    tagId: {
      type: Schema.ObjectId,
      required: true,
      ref: "Tags",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate tag links per content
contentTagsSchema.index({ contentId: 1, tagId: 1 }, { unique: true });

export const ContentTags = mongoose.model("ContentTags", contentTagsSchema);
