import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { AppError, NotFoundError } from "../errors/app-error.js";

/** Client errors raised by Express itself (for example malformed JSON bodies). */
function getFrameworkClientStatus(error: unknown): number | null {
  if (typeof error !== "object" || error === null) return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" && status >= 400 && status < 500
    ? status
    : null;
}

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new NotFoundError("Route not found"));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      status: 400,
      message: "Validation failed",
      details: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  const frameworkStatus = getFrameworkClientStatus(error);
  const statusCode =
    error instanceof AppError ? error.statusCode : (frameworkStatus ?? 500);
  const isExpected = statusCode < 500;

  if (!isExpected) console.error(error);

  const isProduction = env.nodeEnv === "production";
  const message =
    isExpected || !isProduction
      ? error instanceof Error
        ? error.message
        : "Internal Server Error"
      : "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    stack:
      !isProduction && error instanceof Error ? error.stack : undefined,
  });
};
