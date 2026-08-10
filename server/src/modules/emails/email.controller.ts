import type { Request, Response } from "express";

import {
  deleteEmailById,
  getAllEmails,
} from "./email.service";

export async function getEmailsController(
  _req: Request,
  res: Response,
) {
  const emails = await getAllEmails();

  res.json({
    data: emails,
  });
}

export async function deleteEmailController(
  req: Request,
  res: Response,
) {
  const id = req.params.id as string;

  const deleted = await deleteEmailById(id);

  if (!deleted) {
    res.status(404).json({
      message: "Email not found",
    });

    return;
  }

  res.status(204).send();
}