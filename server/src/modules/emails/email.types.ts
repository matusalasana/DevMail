export type EmailRecipientType = "to" | "cc" | "bcc";

export interface ParsedEmailRecipient {
  address: string;
  type: EmailRecipientType;
}

export interface ParsedEmailHeader {
  name: string;
  value: string;
}

export interface ParsedEmailAttachment {
  filename: string;
  contentType: string | null;
  size: number;
  contentId: string | null;
  content: Buffer;
}

export interface ParsedEmail {
  messageId: string | null;
  sender: string;
  replyTo: string | null;
  subject: string;
  textBody: string | null;
  htmlBody: string | null;

  recipients: ParsedEmailRecipient[];

  headers: ParsedEmailHeader[];

  attachments: ParsedEmailAttachment[];

  receivedAt: Date;
}