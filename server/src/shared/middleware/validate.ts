import type { RequestHandler } from "express";
import type { ZodType } from "zod";

/** Validates `req.body` and replaces it with the parsed (stripped) value. */
export const validateBody =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    req.body = schema.parse(req.body);
    next();
  };

/** Validates `req.params`; a ZodError is turned into a 400 by the error handler. */
export const validateParams =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    schema.parse(req.params);
    next();
  };
