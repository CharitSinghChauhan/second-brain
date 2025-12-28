import { Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  hashedRefreshToken: string | null;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  isPasswordCorrect: (password: string) => boolean;
}

export interface IBrain extends Document {
  shareableLink: string;
  visibility: string;
  ownerId: Types.ObjectId;
}

export interface IContent extends Document {
  title?: string;
  description?: string;
  contentLink?: string;
  type: string;
  brainId?: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface ITags extends Document {
  value: string;
}

export interface IContentTags extends Document {
  contentId: Types.ObjectId;
  tagId: Types.ObjectId;
}
