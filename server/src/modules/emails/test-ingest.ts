import { randomUUID } from "node:crypto";

import { ingestEmail } from "./email.service";

async function main() {
  const emailId = randomUUID();

  const testEmail = {
    messageId: `<test-${emailId}@devmail.local>`,

    sender: "sender@example.com",

    replyTo: "reply@example.com",

    subject: "DevMail ingestion test",

    textBody: "This is a test email from DevMail.",

    htmlBody: `
      <h1>Hello DevMail</h1>
      <p>This is a test email.</p>
    `,

    recipients: [
      {
        address: "test@devmail.local",
        type: "to" as const,
      },
    ],

    headers: [
      {
        name: "X-DevMail-Test",
        value: "true",
      },
    ],

    attachments: [
      {
        filename: "test.txt",
        contentType: "text/plain",
        size: Buffer.byteLength("Hello from DevMail"),
        contentId: null,
        content: Buffer.from("Hello from DevMail"),
      },
    ],

    receivedAt: new Date(),
  };

  try {
    const createdEmail = await ingestEmail(testEmail);

    console.log("✅ Email ingestion succeeded");
    console.log("Created email:", createdEmail);
  } catch (error) {
    console.error("❌ Email ingestion failed");
    console.error(error);

    process.exit(1);
  }
}

main();