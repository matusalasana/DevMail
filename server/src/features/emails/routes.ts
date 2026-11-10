import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "../../shared/middleware/validate.js";
import { emailController } from "./controller.js";
import { createEmailSchema, emailIdParamsSchema } from "./validation.js";

export const emailRoutes = Router();

emailRoutes.get("/", emailController.listEmails);
emailRoutes.post("/", validateBody(createEmailSchema), emailController.createEmail);
emailRoutes.delete("/", emailController.deleteAllEmails);
emailRoutes.get("/:id", validateParams(emailIdParamsSchema), emailController.getEmail);
emailRoutes.delete("/:id", validateParams(emailIdParamsSchema), emailController.deleteEmail);
