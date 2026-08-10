import type { NeonDatabase } from "drizzle-orm/neon-serverless";

import {
  emailAttachments,
  emailHeaders,
  emailRecipients,
  emails,
} from "../../db/schema";

import type { ParsedEmail } from "./email.types";

export async function createEmail(
  tx: NeonDatabase,
  emailId: string,
  email: ParsedEmail,
) {
  const [createdEmail] = await tx
    .insert(emails)
    .values({
      id: emailId,
      messageId: email.messageId,
      sender: email.sender,
      replyTo: email.replyTo,
      subject: email.subject,
      textBody: email.textBody,
      htmlBody: email.htmlBody,
      receivedAt: email.receivedAt,
    })
    .returning();

  if (!createdEmail) {
    throw new Error("Failed to create email");
  }

  return createdEmail;
}

export async function createRecipients(
  tx: NeonDatabase,
  emailId: string,
  recipients: ParsedEmail["recipients"],
) {
  if (recipients.length === 0) {
    return [];
  }

  return tx
    .insert(emailRecipients)
    .values(
      recipients.map((recipient) => ({
        emailId,
        address: recipient.address,
        type: recipient.type,
      })),
    )
    .returning();
}

export async function createHeaders(
  tx: NeonDatabase,
  emailId: string,
  headers: ParsedEmail["headers"],
) {
  if (headers.length === 0) {
    return [];
  }

  return tx
    .insert(emailHeaders)
    .values(
      headers.map((header) => ({
        emailId,
        name: header.name,
        value: header.value,
      })),
    )
    .returning();
}

export async function createAttachments(
  tx: NeonDatabase,
  emailId: string,
  attachments: Array<{
    filename: string;
    contentType: string | null;
    size: number;
    contentId: string | null;
    path: string;
  }>,
) {
  if (attachments.length === 0) {
    return [];
  }

  return tx
    .insert(emailAttachments)
    .values(
      attachments.map((attachment) => ({
        emailId,
        filename: attachment.filename,
        contentType: attachment.contentType,
        size: attachment.size,
        contentId: attachment.contentId,
        path: attachment.path,
      })),
    )
    .returning();
}