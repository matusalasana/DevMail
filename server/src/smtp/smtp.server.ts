import { SMTPServer } from "smtp-server";

import { ingestEmail } from "../modules/emails/email.service.js";
import { parseEmail } from "./mail-parser.js";

const SMTP_HOST = process.env.SMTP_HOST ?? "0.0.0.0";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 1025);

export const smtpServer = new SMTPServer({
  disabledCommands: ["AUTH"],

  onData(stream, _session, callback) {
    parseEmail(stream)
      .then(async (parsedEmail) => {
        await ingestEmail(parsedEmail);

        callback(null);
      })
      .catch((error) => {
        console.error("❌ Failed to process incoming email:", error);

        callback(error);
      });
  },
});

export function startSmtpServer() {
  smtpServer.listen(SMTP_PORT, SMTP_HOST, () => {
    console.log(
      `📨 DevMail SMTP running on ${SMTP_HOST}:${SMTP_PORT}`,
    );
  });
}