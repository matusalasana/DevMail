import { and, eq } from "drizzle-orm";
import { db } from "../../db"; // Point to your database connection instance
import { emails } from "../../db/schema/emails";

const getEmails = async () => {
  const list = await db.select().from(emails);
  return list ?? [];
};

const getEmail = async (emailId: string) => {
  const result = await db
    .select()
    .from(emails)
    .where(eq(emails.id, emailId));

  return result[0] ?? null;
};

const create = async (email: NewEmail): Promise<Email | null> => {
  const createdEmail = await db
    .insert(emails)
    .values({
      ...email,
      receivedAt: new Date(),
    })
    .returning();

  return createdEmail[0] ?? null;
};

const deleteById = async (emailId: string): Promise<Email | null> => {
  const deletedEmail = await db
    .delete(emails)
    .where(eq(emails.id, emailId))
    .returning();

  return deletedEmail[0] ?? null;
};

const deleteAll = async () => {
  await db.delete(emails);

  return {
    message: "Inbox cleared",
  };
};

export const EmailRepository = {
  getEmails,
  getEmail,
  create,
  deleteById,
  deleteAll,
};
