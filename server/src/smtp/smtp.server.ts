import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";

const SMTP_HOST = process.env.SMTP_HOST ?? "0.0.0.0";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 1025);

export interface DevMail {
  id: number;
  from: string;
  subject: string;
  html: string;
  text: string;
  date: string;
}

export const emails: DevMail[] = [];

export const smtpServer = new SMTPServer({
  disabledCommands: ["AUTH"],

  onData(stream, _session, callback) {
    simpleParser(stream, async (err, parsed) => {
      if (err) {
        callback(err);
        return;
      }

      emails.unshift({
        id: Date.now(),
        from: parsed.from?.text ?? "Unknown",
        subject: parsed.subject ?? "(No Subject)",
        html: parsed.html || parsed.textAsHtml || "",
        text: parsed.text ?? "",
        date: new Date().toISOString(),
      });

      callback(null);
    });
  },
});

export function startSmtpServer() {
  smtpServer.listen(SMTP_PORT, SMTP_HOST, () => {
    console.log(`DevMail SMTP running on port ${SMTP_PORT}`);
  });
}