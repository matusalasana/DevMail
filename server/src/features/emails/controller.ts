import type { Request, Response } from "express";
import { emailService } from "./service.js";
import type { CreateEmailInput, EmailIdParams } from "./validation.js";

const listEmails = async (_req: Request, res: Response) => {
  const emails = await emailService.listEmails();
  res.status(200).json({ success: true, data: emails });
};

const getEmail = async (req: Request<EmailIdParams>, res: Response) => {
  const email = await emailService.getEmail(req.params.id);
  res.status(200).json({ success: true, data: email });
};

const createEmail = async (
  req: Request<Record<string, never>, unknown, CreateEmailInput>,
  res: Response,
) => {
  const email = await emailService.createEmail(req.body);
  res.status(201).json({ success: true, data: email });
};

const deleteEmail = async (req: Request<EmailIdParams>, res: Response) => {
  await emailService.deleteEmail(req.params.id);
  res.status(200).json({ success: true, message: "Email deleted successfully" });
};

const deleteAllEmails = async (_req: Request, res: Response) => {
  await emailService.deleteAllEmails();
  res
    .status(200)
    .json({ success: true, message: "All emails deleted successfully" });
};

export const emailController = {
  listEmails,
  getEmail,
  createEmail,
  deleteEmail,
  deleteAllEmails,
};
