import mongoose, { Model, Schema } from "mongoose";
import type { IUser } from "../types/usertype.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true },
  hashedRefreshToken: { type: String || null },
});

userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;

  // what is salt
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

userSchema.methods.generateAccessToken = function (): string {
  if (!process.env.ACCESS_TOKEN_SECRET)
    throw new Error("ACCESS_TOKEN_SECRET environment variable is not defined");

  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  if (!process.env.REFRESH_TOKEN_SECRET)
    throw new Error("REFRESH_TOKEN_SECRET environment variable is not defined");

  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

userSchema.methods.isPasswordCorrect = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.passwordHash);
};

export const User: Model<IUser> = mongoose.model("User", userSchema);
