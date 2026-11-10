import "../../test-support/env.js";
import assert from "node:assert/strict";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, afterEach, before, describe, it, mock } from "node:test";
import app from "../../app.js";
import { emailRepository } from "./repository.js";
import type { Email } from "./types.js";

const EMAIL_ID = "6f1c2f1e-8a53-4d7c-9d1c-3a3e4b5c6d7e";
const storedEmail: Email = {
  id: EMAIL_ID,
  from: "a@example.test",
  to: "b@example.test",
  subject: "Hello",
  textBody: "text",
  htmlBody: "<p>html</p>",
  receivedAt: new Date("2026-01-01T00:00:00Z"),
  createdAt: new Date("2026-01-01T00:00:00Z"),
};

let server: Server;
let origin: string;
let baseUrl: string;

before(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, "127.0.0.1", () => resolve());
  });
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  baseUrl = `${origin}/api/v1/emails`;
});
after(() => new Promise<void>((resolve) => server.close(() => resolve())));
afterEach(() => mock.restoreAll());

const json = (response: Response) =>
  response.json() as Promise<Record<string, unknown>>;

describe("GET /api/v1/emails", () => {
  it("returns the stored emails", async () => {
    mock.method(emailRepository, "findAll", async () => [storedEmail]);
    const response = await fetch(baseUrl);
    const body = await json(response);
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal((body.data as Email[])[0]?.id, EMAIL_ID);
  });
});

describe("GET /api/v1/emails/:id", () => {
  it("returns one email", async () => {
    mock.method(emailRepository, "findById", async () => storedEmail);
    const response = await fetch(`${baseUrl}/${EMAIL_ID}`);
    assert.equal(response.status, 200);
    assert.equal(((await json(response)).data as Email).subject, "Hello");
  });

  it("returns 404 when the email does not exist", async () => {
    mock.method(emailRepository, "findById", async () => null);
    const response = await fetch(`${baseUrl}/${EMAIL_ID}`);
    const body = await json(response);
    assert.equal(response.status, 404);
    assert.equal(body.success, false);
    assert.equal(body.message, "Email not found");
  });

  it("returns 400 without querying the database for an invalid id", async () => {
    const findById = mock.method(emailRepository, "findById", async () => null);
    const response = await fetch(`${baseUrl}/not-a-uuid`);
    assert.equal(response.status, 400);
    assert.equal(findById.mock.callCount(), 0);
  });
});

describe("POST /api/v1/emails", () => {
  const post = (body: string) =>
    fetch(baseUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });

  it("creates an email and returns 201", async () => {
    const create = mock.method(emailRepository, "create", async () => storedEmail);
    const response = await post(
      JSON.stringify({ from: "a@example.test", to: "b@example.test", subject: "Hello" }),
    );
    assert.equal(response.status, 201);
    assert.equal(create.mock.callCount(), 1);
  });

  it("returns 400 with details for an invalid body", async () => {
    const create = mock.method(emailRepository, "create", async () => storedEmail);
    const response = await post(JSON.stringify({ subject: "missing sender" }));
    const body = await json(response);
    assert.equal(response.status, 400);
    assert.equal(body.message, "Validation failed");
    assert.equal(create.mock.callCount(), 0);
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await post("{not json");
    assert.equal(response.status, 400);
  });
});

describe("DELETE /api/v1/emails", () => {
  it("deletes one email", async () => {
    mock.method(emailRepository, "deleteById", async () => storedEmail);
    const response = await fetch(`${baseUrl}/${EMAIL_ID}`, { method: "DELETE" });
    assert.equal(response.status, 200);
  });

  it("returns 404 when deleting a missing email", async () => {
    mock.method(emailRepository, "deleteById", async () => null);
    const response = await fetch(`${baseUrl}/${EMAIL_ID}`, { method: "DELETE" });
    assert.equal(response.status, 404);
  });

  it("clears the inbox", async () => {
    const deleteAll = mock.method(emailRepository, "deleteAll", async () => undefined);
    const response = await fetch(baseUrl, { method: "DELETE" });
    assert.equal(response.status, 200);
    assert.equal(deleteAll.mock.callCount(), 1);
  });
});

describe("error handling", () => {
  it("returns a JSON 500 when the repository fails", async () => {
    mock.method(console, "error", () => undefined);
    mock.method(emailRepository, "findAll", async () => {
      throw new Error("connection reset");
    });
    const response = await fetch(baseUrl);
    const body = await json(response);
    assert.equal(response.status, 500);
    assert.equal(body.success, false);
  });

  it("returns a JSON 404 for unknown routes", async () => {
    const response = await fetch(`${origin}/nope`);
    assert.equal(response.status, 404);
    assert.equal((await json(response)).success, false);
  });
});
