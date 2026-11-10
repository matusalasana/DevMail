import type { Readable } from "node:stream";
import { simpleParser, type AddressObject } from "mailparser";
import type { NewEmail } from "../emails/index.js";
import { NO_SUBJECT, UNKNOWN_ADDRESS } from "./constants.js";

function joinAddresses(
  addresses: AddressObject | AddressObject[] | undefined,
): string {
  if (!addresses) return "";
  const list = Array.isArray(addresses) ? addresses : [addresses];
  return list.map((address) => address.text).join(", ");
}

/**
 * Parses a raw RFC 822 message stream into the fields DevMail stores.
 * Missing parts fall back to placeholders so incomplete messages are still captured.
 * `envelopeRecipients` (SMTP RCPT TO) is used when the message has no `To` header, e.g. BCC.
 */
export async function parseRawEmail(
  stream: Readable,
  envelopeRecipients: string[] = [],
): Promise<NewEmail> {
  const parsed = await simpleParser(stream);

  return {
    from: parsed.from?.text || UNKNOWN_ADDRESS,
    to:
      joinAddresses(parsed.to) ||
      envelopeRecipients.join(", ") ||
      UNKNOWN_ADDRESS,
    subject: parsed.subject || NO_SUBJECT,
    textBody: parsed.text ?? "",
    // mailparser returns `false` when the message has no HTML part.
    htmlBody: typeof parsed.html === "string" ? parsed.html : "",
  };
}
