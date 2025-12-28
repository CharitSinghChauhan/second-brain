import mongoose, { Model, Schema } from "mongoose";
import type { ITags } from "../types/types.js";


const tagsSchema = new Schema<ITags>({
  value: {
    type: String,
    unique: true,
    required: true,
  },
});

export const Tags: Model<ITags> = mongoose.model<ITags>("Tags", tagsSchema);
