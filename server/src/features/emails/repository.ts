import { desc, eq } from "drizzle-orm";
import { db } from "../../shared/database/client.js";
import { emails } from "./schema.js";
import type { Email, NewEmail } from "./types.js";

const findAll = (): Promise<Email[]> =>
  db.select().from(emails).orderBy(desc(emails.receivedAt));

const findById = async (emailId: string): Promise<Email | null> => {
  const [email] = await db.select().from(emails).where(eq(emails.id, emailId));
  return email ?? null;
};

const create = async (newEmail: NewEmail): Promise<Email> => {
  const [email] = await db
    .insert(emails)
    .values({ ...newEmail, receivedAt: new Date() })
    .returning();

  if (!email) throw new Error("Email insert did not return a row");
  return email;
};

const deleteById = async (emailId: string): Promise<Email | null> => {
  const [email] = await db
    .delete(emails)
    .where(eq(emails.id, emailId))
    .returning();
  return email ?? null;
};

const deleteAll = async (): Promise<void> => {
  await db.delete(emails);
};

export const emailRepository = {
  findAll,
  findById,
  create,
  deleteById,
  deleteAll,
};
