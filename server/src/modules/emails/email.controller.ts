import type { Request, Response } from "express";

import {
  deleteEmailById,
  getAllEmails,
  getEmailById,
  getEmailAttachment,
} from "./email.service";


export async function downloadAttachmentController(
  req: Request,
  res: Response,
) {
  const emailId = req.params.id as string;
  const attachmentId = req.params.attachmentId as string;

  const email = await getEmailById(emailId);

  if (!email) {
    res.status(404).json({
      message: "Email not found",
    });

    return;
  }

  const result = await getEmailAttachment(
    emailId,
    attachmentId,
  );

  if (!result) {
    res.status(404).json({
      message: "Attachment not found",
    });

    return;
  }

  const { attachment, content } = result;

  res.setHeader(
    "Content-Type",
    attachment.contentType || "application/octet-stream",
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${attachment.filename}"`,
  );

  res.send(content);
}


export async function getEmailController(
  req: Request,
  res: Response,
) {
  const id = req.params.id as string;

  const email = await getEmailById(id);

  if (!email) {
    res.status(404).json({
      message: "Email not found",
    });

    return;
  }

  res.json({
    data: email,
  });
}

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