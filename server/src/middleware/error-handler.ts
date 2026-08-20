import { env } from "../config/env.js"
import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(error);

  res.status(statusCode).json({
    status: statusCode,
    message: error.message,
    stack: process.env.nodeEnv === 'production' ? null : error.stack,
  });
};