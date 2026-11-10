import type { Email } from "../types";

/** One-line preview text for the inbox list; tolerates emails with no body. */
export function getBodyPreview(email: Email): string {
  return (
    email.textBody ||
    email.htmlBody?.replace(/<[^>]*>?/gm, "") ||
    "No text preview"
  );
}
