import "../../test-support/env.js";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createEmailSchema, emailIdParamsSchema } from "./validation.js";

describe("emailIdParamsSchema", () => {
  it("accepts a UUID", () => {
    const id = "6f1c2f1e-8a53-4d7c-9d1c-3a3e4b5c6d7e";
    assert.equal(emailIdParamsSchema.parse({ id }).id, id);
  });

  it("rejects anything that is not a UUID", () => {
    assert.throws(() => emailIdParamsSchema.parse({ id: "123" }));
  });
});

describe("createEmailSchema", () => {
  it("accepts a minimal email", () => {
    const parsed = createEmailSchema.parse({
      from: "a@x.test",
      to: "b@x.test",
      subject: "Hi",
    });
    assert.equal(parsed.subject, "Hi");
  });

  it("strips unknown fields so columns such as id cannot be set", () => {
    const parsed = createEmailSchema.parse({
      from: "a@x.test",
      to: "b@x.test",
      subject: "Hi",
      id: "00000000-0000-4000-8000-000000000000",
    });
    assert.equal("id" in parsed, false);
  });

  it("rejects missing required fields", () => {
    assert.throws(() => createEmailSchema.parse({ subject: "Hi" }));
  });
});
