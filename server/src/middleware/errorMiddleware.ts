import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError.js";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.httpsCode || 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof ApiError) {
    return res.status(statusCode).json({
      httpsCode: err.httpsCode,
      type: err.type,
      message: err.message,
      success: err.success,
      payload: err.payload,
      errors: err.errors,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? undefined : message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export default errorMiddleware;
