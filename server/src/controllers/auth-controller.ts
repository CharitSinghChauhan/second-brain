import type { Request, Response } from "express";
import { signInSchema, signUpSchema } from "../zod/zod-type.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user-model.js";
import type { IUser } from "../types/types.js";
import bcrypt from "bcryptjs";
import ApiResponse from "../utils/apiResponse.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

const generateToken = async (user: IUser) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    user.hashedRefreshToken = hashedRefreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Token generation failed",
      null,
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export const signUpController = async (req: Request, res: Response) => {
  const zodResult = signUpSchema.safeParse(req.body);

  if (!zodResult.success) {
    throw new ApiError(
      422,
      "validation failed",
      zodResult.data,
      zodResult.error.name,
      zodResult.error
    );
  }

  // email and username has to unique
  const isUserExist = await User.findOne({
    $or: [
      {
        email: zodResult.data.email,
      },
      { username: zodResult.data.username },
    ],
  });

  if (isUserExist) throw new ApiError(409, "User already exists", req.body);

  const newUser = await User.create({
    username: zodResult.data.username,
    email: zodResult.data.email,
    passwordHash: zodResult.data.password,
  });

  const { accessToken, refreshToken } = await generateToken(newUser);

  const safeUser = await User.findById(newUser._id).select(
    "-passwordHash -hashedRefreshToken -__v -_id"
  );

  const cookieOptions = {
    httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript (prevents XSS)
    secure: process.env.NODE_ENV === "production", // Ensures the cookie is only sent over HTTPS (essential for production)
    sameSite: "strict" as const, // Controls cross-site request behavior (use 'None' if secure is true for cross-origin)
    path: "/",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 3600 * 1000,
    })
    .json(new ApiResponse(201, safeUser?.toObject(), "successfully register"));
};

export const signInController = async (req: Request, res: Response) => {
  const zodResult = signInSchema.safeParse(req.body);

  if (!zodResult.success)
    throw new ApiError(
      422,
      zodResult.error.message,
      req.body,
      zodResult.error.name,
      zodResult.error
    );

  const isUserExist = await User.findOne({
    $or: [
      { email: zodResult.data.emailOrUsername },
      { username: zodResult.data.emailOrUsername },
    ],
  });

  if (!isUserExist) throw new ApiError(409, "user not found", req.body);

  const isPasswordCorrect = isUserExist.isPasswordCorrect(
    zodResult.data.password
  );

  if (!isPasswordCorrect) {
    throw new ApiError(401, "password is incorrect", req.body);
  }

  const { accessToken, refreshToken } = await generateToken(isUserExist);

  const safeUser = await User.findById(isUserExist._id).select(
    "-passwordHash -hashedRefreshToken -__v -_id"
  );

  const cookieOptions = {
    httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript (prevents XSS)
    secure: process.env.NODE_ENV === "production", // Ensures the cookie is only sent over HTTPS (essential for production)
    sameSite: "strict" as const, // Controls cross-site request behavior (use 'None' if secure is true for cross-origin)
    path: "/",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 3600 * 1000,
    })
    .json(new ApiResponse(201, safeUser?.toObject(), "SignIn successfully"));
};

export const signOutController = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) return res.json(new ApiError(404, "Auth Error"));

  await User.findByIdAndUpdate(userId, {
    $unset: { hashedRefreshToken: 1 },
  });

  return res
    .status(200)
    .clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })
    .json(new ApiResponse(200, {}, "SignOut successfully"));
};

export const meController = async (req: Request, res: Response) => {
  const user = req.user;

  return res.status(200).json(new ApiResponse(200, user, "logIn successfully"));
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    throw new ApiError(
      401,
      "Refresh Token Missing",
      {
        refreshToken,
      },
      "Validation"
    );

  if (!process.env.REFRESH_TOKEN_SECRET)
    throw new ApiError(
      404,
      "Refresh Token secret missing",
      {
        refreshToken,
      },
      "Validation"
    );

  const { _id } = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  ) as JwtPayload;

  const isUserExist = await User.findById(_id).select("-passwordHash -__v");

  if (!isUserExist || !isUserExist.hashedRefreshToken)
    throw new ApiError(404, "User not found", null, "Validation");

  const isTokenValid = await bcrypt.compare(
    refreshToken,
    isUserExist.hashedRefreshToken
  );

  if (!isTokenValid) {
    isUserExist.hashedRefreshToken = null;
    await isUserExist.save();
    throw new ApiError(401, "Refresh token reuse detected");
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateToken(
    isUserExist
  );

  const cookieOptions = {
    httpOnly: true, // can't access via js document.cookie
    secure: process.env.NODE_ENV === "production", // only send cookie on https
    sameSite: "strict" as const, // explain
    path: "/",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 3600 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        {
          email: isUserExist.email,
          username: isUserExist.username,
        },
        "refresh Token sent successfully"
      )
    );
};
