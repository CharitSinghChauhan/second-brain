import { User } from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) throw new ApiError(401, "Authorization token missing");

  if (!process.env.ACCESS_TOKEN_SECRET)
    throw new ApiError(500, "ACCESS_TOKEN_SECRET environment variable missing");

  // TODO : as JwtPayload not : JwtPayload
  const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  if (typeof payload === "string")
    throw new ApiError(401, "Token invalid", null);

  const isUserExist = await User.findById({
    _id: payload._id,
  }).select("-passwordHash -hashedRefreshToken -__v -_id");

  if (!isUserExist)
    throw new ApiError(401, "User not found", null, "auth middleware");

  req.user = isUserExist;

  next();
};

export default authMiddleware;
