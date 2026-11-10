import type { emails } from "./schema.js";

/** A captured email as stored in the database. */
export type Email = typeof emails.$inferSelect;

/** The fields a caller provides to store a new email. `receivedAt` is set on insert. */
export type NewEmail = {
  from: string;
  to: string;
  subject: string;
  textBody?: string | null;
  htmlBody?: string | null;
};
