import type { ErrorRequestHandler } from "express";
import { env } from "../config/env.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(error);

  const message = error instanceof Error ? error.message : "Internal Server Error";
  const stack = error instanceof Error ? error.stack : undefined;

  res.status(statusCode).json({
    status: statusCode,
    message,
    stack: env.nodeEnv === "production" ? null : stack,
  });
};
