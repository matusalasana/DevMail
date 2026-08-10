import { db } from "../../db";
import {
  createAttachments,
  createEmail,
  createHeaders,
  createRecipients,
  deleteEmail,
  findAllEmails,
} from "./email.repository";
import { removeAttachmentDirectory, storeAttachments } from "../../storage/attachment.storage";

import type { ParsedEmail } from "./email.types";


export async function getAllEmails() {
  return findAllEmails();
}


export async function ingestEmail(email: ParsedEmail) {
  const emailId = crypto.randomUUID();

  let attachmentsStored = false;

  try {
    // 1. Store attachments on the filesystem first.
    const storedAttachments = await storeAttachments(
      emailId,
      email.attachments,
    );

    attachmentsStored = storedAttachments.length > 0;

    // 2. Store all email metadata inside one PostgreSQL transaction.
    const createdEmail = await db.transaction(async (tx) => {
      const created = await createEmail(tx, emailId, email);

      await createRecipients(
        tx,
        created.id,
        email.recipients,
      );

      await createHeaders(
        tx,
        created.id,
        email.headers,
      );

      await createAttachments(
        tx,
        created.id,
        storedAttachments,
      );

      return created;
    });

    return createdEmail;
  } catch (error) {
    if (attachmentsStored) {
      await removeAttachmentDirectory(emailId);
    }

    throw error;
  }
}

export async function deleteEmailById(
  emailId: string,
): Promise<boolean> {
  const deletedEmail = await db.transaction(async (tx) => {
    return deleteEmail(tx, emailId);
  });

  if (!deletedEmail) {
    return false;
  }

  try {
    await removeAttachmentDirectory(emailId);
  } catch (error) {
    console.error(
      `⚠️ Failed to remove attachment directory for email ${emailId}`,
      error,
    );
  }

  return true;
}