import type { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  hashedRefreshToken: string;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  isPasswordCorrect : (password: string) => boolean
}
