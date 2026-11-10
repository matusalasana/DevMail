import type { AddressInfo } from "node:net";
import { SMTPServer } from "smtp-server";
import { env } from "../../shared/config/env.js";
import { emailService } from "../emails/index.js";
import { SMTP_MAX_MESSAGE_BYTES } from "./constants.js";
import { parseRawEmail } from "./parser.js";

const MESSAGE_TOO_LARGE = 552;

export function createSmtpServer(): SMTPServer {
  return new SMTPServer({
    // DevMail is a local capture tool: accept any sender without authentication.
    authOptional: true,
    size: SMTP_MAX_MESSAGE_BYTES,

    onData(stream, session, callback) {
      const envelopeRecipients = session.envelope.rcptTo.map(
        (recipient) => recipient.address,
      );

      parseRawEmail(stream, envelopeRecipients)
        .then(async (newEmail) => {
          if (stream.sizeExceeded) {
            throw Object.assign(new Error("Message exceeds size limit"), {
              responseCode: MESSAGE_TOO_LARGE,
            });
          }
          const email = await emailService.createEmail(newEmail);
          console.log(`Captured email ${email.id}: ${email.subject}`);
          callback();
        })
        .catch((error: unknown) => {
          // Rejecting makes the sending client see a failure instead of silently losing the message.
          console.error("Failed to capture email:", error);
          callback(error instanceof Error ? error : new Error(String(error)));
        });
    },
  });
}

export interface SmtpListenOptions {
  host: string;
  port: number;
}

/** Starts the SMTP server. Resolves with the server and the port it is listening on. */
export function startSmtpServer(
  options: SmtpListenOptions = { host: env.smtpHost, port: env.smtpPort },
): Promise<{ server: SMTPServer; port: number }> {
  const server = createSmtpServer();

  return new Promise((resolve, reject) => {
    server.server.once("error", reject);
    server.listen(options.port, options.host, () => {
      server.server.off("error", reject);
      const { port } = server.server.address() as AddressInfo;
      resolve({ server, port });
    });
  });
}

export function stopSmtpServer(server: SMTPServer): Promise<void> {
  return new Promise((resolve) => server.close(() => resolve()));
}
