import "../../test-support/env.js";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { describe, it } from "node:test";
import { parseRawEmail } from "./parser.js";

const raw = (message: string) => Readable.from([message.replace(/\n/g, "\r\n")]);

describe("parseRawEmail", () => {
  it("extracts sender, recipients, subject, text and html", async () => {
    const email = await parseRawEmail(
      raw(
        [
          "From: Alice <alice@example.test>",
          "To: bob@example.test, carol@example.test",
          "Subject: Hello",
          'Content-Type: multipart/alternative; boundary="b"',
          "",
          "--b",
          "Content-Type: text/plain",
          "",
          "plain body",
          "--b",
          "Content-Type: text/html",
          "",
          "<p>html body</p>",
          "--b--",
          "",
        ].join("\n"),
      ),
    );

    assert.equal(email.from, "\"Alice\" <alice@example.test>");
    assert.equal(email.to, "bob@example.test, carol@example.test");
    assert.equal(email.subject, "Hello");
    assert.equal(email.textBody?.trim(), "plain body");
    assert.equal(email.htmlBody?.trim(), "<p>html body</p>");
  });

  it("stores an empty string, not false, when there is no HTML part", async () => {
    const email = await parseRawEmail(
      raw("From: a@example.test\nTo: b@example.test\nSubject: Plain\n\ntext only\n"),
    );
    assert.equal(email.htmlBody, "");
    assert.equal(email.textBody?.trim(), "text only");
  });

  it("falls back to placeholders for an incomplete message", async () => {
    const email = await parseRawEmail(raw("X-Custom: only a header\n\nbody\n"));
    assert.equal(email.from, "Unknown");
    assert.equal(email.to, "Unknown");
    assert.equal(email.subject, "(No Subject)");
  });

  it("uses the SMTP envelope recipients when the To header is missing", async () => {
    const email = await parseRawEmail(
      raw("From: a@example.test\nSubject: Bcc\n\nbody\n"),
      ["hidden@example.test", "other@example.test"],
    );
    assert.equal(email.to, "hidden@example.test, other@example.test");
  });

  it("does not throw on non-email input", async () => {
    const email = await parseRawEmail(raw("\u0000\u0001 not an email at all"));
    assert.equal(email.subject, "(No Subject)");
  });
});
