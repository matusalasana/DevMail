import { SMTPServer } from "smtp-server";
import { simpleParser } from 'mailparser';
import { EmailRepository } from '../modules/emails/email.repository';

const SMTP_HOST = process.env.SMTP_HOST ?? "0.0.0.0";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 1025);

export const smtpServer = new SMTPServer({
  // Disable authentication for local development testing
  authOptional: true,

  // Event handler triggered when a mail stream is received
  onData(stream, session, callback) {
    // Parse the raw stream using mailparser
    simpleParser(stream)
      .then( async (parsed) => {
        const insertedEmail = await EmailRepository.create({
            from: parsed.from?.value?.[0]?.address || "Unknown",
            to: parsed.to?.value?.map((recipient) => recipient.address).join(", ") || "Unknown",
            subject: parsed.subject || '(No Subject)',
            messageId: parsed.messageId,
            sender: parsed.sender?.value?.[0]?.name || "Unknown",
            replyTo: parsed.replyTo?.value?.[0]?.address || null,
            textBody: parsed.text || '',
            htmlBody: parsed.html || '',
          });

        console.log(`\n💾 Email saved to DB via Drizzle! ID: ${insertedEmail.id}`);
        console.log(`Subject: ${insertedEmail.subject}\n`);

        callback(); // Accept email
      })
      .catch(err => {
        console.error('Error parsing email:', err);
        // Pass the error back to reject the email transmission
        callback(err); 
      });
  }
});

export function startSmtpServer() {
  smtpServer.listen(SMTP_PORT, SMTP_HOST, () => {
    console.log(
      `📨 DevMail SMTP running on ${SMTP_HOST}:${SMTP_PORT}`,
    );
  });
}