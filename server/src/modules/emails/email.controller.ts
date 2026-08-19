import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { EmailService } from "./email.service";

const getEmails = asyncHandler(async (req: Request, res: Response) => {
  const emails = await EmailService.getEmails();

  res.status(200).json({
    success: true,
    data: emails,
  });
});

const getEmail = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const email = await EmailService.getEmail(id);

  if (!email) {
    return res.status(404).json({
      success: false,
      message: "Email not found",
    });
  }

  res.status(200).json({
    success: true,
    data: email,
  });
});

const createEmail = asyncHandler(async (req: Request, res: Response) => {
  const newEmail = await EmailService.createEmail(req.body);

  res.status(201).json({
    success: true,
    data: newEmail,
  });
});

const deleteEmail = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await EmailService.deleteEmail(id);

  res.status(200).json({
    success: true,
    message: "Email deleted successfully",
  });
});

const deleteAllEmails = asyncHandler(async (req: Request, res: Response) => {
  await EmailService.deleteAllEmails();

  res.status(200).json({
    success: true,
    message: "All emails deleted successfully",
  });
});

export const EmailController = {
  getEmails,
  getEmail,
  createEmail,
  deleteEmail,
  deleteAllEmails,
};
