import "../../test-support/env.js";
import assert from "node:assert/strict";
import { after, afterEach, before, describe, it, mock } from "node:test";
import type { SMTPServer } from "smtp-server";
import { sendRawMessage } from "../../test-support/smtp-client.js";
import { emailRepository } from "../emails/repository.js";
import type { Email } from "../emails/types.js";
import { startSmtpServer, stopSmtpServer } from "./server.js";

let server: SMTPServer;
let port: number;

before(async () => {
  ({ server, port } = await startSmtpServer({ host: "127.0.0.1", port: 0 }));
});
after(() => stopSmtpServer(server));
afterEach(() => mock.restoreAll());

const message = [
  "From: Sender <sender@example.test>",
  "To: dev@example.test",
  "Subject: Captured",
  "",
  "hello from smtp",
].join("\n");

const storedEmail: Email = {
  id: "6f1c2f1e-8a53-4d7c-9d1c-3a3e4b5c6d7e",
  from: "",
  to: "",
  subject: "Captured",
  textBody: null,
  htmlBody: null,
  receivedAt: new Date(),
  createdAt: new Date(),
};

describe("SMTP capture", () => {
  it("parses an incoming message and persists it", async () => {
    mock.method(console, "log", () => undefined);
    const create = mock.method(emailRepository, "create", async () => storedEmail);

    const replies = await sendRawMessage(port, {
      from: "sender@example.test",
      to: ["dev@example.test"],
      message,
    });

    assert.ok(replies.some((reply) => reply.startsWith("250")));
    assert.equal(create.mock.callCount(), 1);
    const saved = create.mock.calls[0]?.arguments[0];
    assert.equal(saved?.subject, "Captured");
    assert.equal(saved?.from, "\"Sender\" <sender@example.test>");
    assert.equal(saved?.to, "dev@example.test");
    assert.equal(saved?.textBody?.trim(), "hello from smtp");
  });

  it("handles concurrent connections without losing messages", async () => {
    mock.method(console, "log", () => undefined);
    const create = mock.method(emailRepository, "create", async () => storedEmail);

    await Promise.all(
      Array.from({ length: 10 }, () =>
        sendRawMessage(port, {
          from: "s@example.test",
          to: ["d@example.test"],
          message,
        }),
      ),
    );

    assert.equal(create.mock.callCount(), 10);
  });

  it("rejects the message instead of acknowledging it when persistence fails", async () => {
    mock.method(console, "error", () => undefined);
    mock.method(emailRepository, "create", async () => {
      throw new Error("database down");
    });

    const replies = await sendRawMessage(port, {
      from: "s@example.test",
      to: ["d@example.test"],
      message,
    });

    const failure = replies.find((reply) => /^[45]\d\d/.test(reply));
    assert.ok(failure, `expected an error reply, got ${JSON.stringify(replies)}`);
  });
});
