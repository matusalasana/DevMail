import { simpleParser, type AddressObject } from "mailparser";

import type {
  ParsedEmail,
  ParsedEmailAttachment,
  ParsedEmailHeader,
  ParsedEmailRecipient,
} from "../modules/emails/email.types";

export async function parseEmail(
  stream: NodeJS.ReadableStream,
): Promise<ParsedEmail> {
  const parsed = await simpleParser(stream);

  const recipients: ParsedEmailRecipient[] = [
    ...extractRecipients(parsed.to, "to"),
    ...extractRecipients(parsed.cc, "cc"),
    ...extractRecipients(parsed.bcc, "bcc"),
  ];

  const headers: ParsedEmailHeader[] = [];

  for (const [name, value] of parsed.headers) {
    headers.push({
      name,
      value: normalizeHeaderValue(value),
    });
  }

  const attachments: ParsedEmailAttachment[] = parsed.attachments.map(
    (attachment) => ({
      filename: attachment.filename || "attachment",
      contentType: attachment.contentType || null,
      size: attachment.size,
      contentId: attachment.contentId || null,
      content: attachment.content,
    }),
  );

  return {
    messageId: parsed.messageId || null,

    sender: parsed.from?.text || "Unknown",

    replyTo: parsed.replyTo?.text || null,

    subject: parsed.subject || "(No Subject)",

    textBody: parsed.text || null,

    htmlBody:
      typeof parsed.html === "string"
        ? parsed.html
        : parsed.textAsHtml || null,

    recipients,

    headers,

    attachments,

    receivedAt: parsed.date || new Date(),
  };
}

function extractRecipients(
  addressObject: AddressObject | AddressObject[] | undefined,
  type: "to" | "cc" | "bcc",
): ParsedEmailRecipient[] {
  if (!addressObject) {
    return [];
  }

  const addressObjects = Array.isArray(addressObject)
    ? addressObject
    : [addressObject];

  return addressObjects.flatMap((object) =>
    object.value
      .filter(
        (recipient) =>
          typeof recipient.address === "string" &&
          recipient.address.length > 0,
      )
      .map((recipient) => ({
        address: recipient.address!,
        type,
      })),
  );
}

function normalizeHeaderValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(normalizeHeaderValue).join(", ");
  }

  if (value && typeof value === "object") {
    if ("text" in value && typeof value.text === "string") {
      return value.text;
    }

    if ("value" in value) {
      const nestedValue = value.value;

      if (typeof nestedValue === "string") {
        return nestedValue;
      }

      if (Array.isArray(nestedValue)) {
        return nestedValue
          .map(normalizeHeaderValue)
          .join("; ");
      }
    }

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}