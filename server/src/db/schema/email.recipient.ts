import {
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { emails } from "./emails";

export const recipientTypeEnum = pgEnum("recipient_type", [
  "to",
  "cc",
  "bcc",
]);

export const emailRecipients = pgTable("email_recipients", {
  id: uuid("id").defaultRandom().primaryKey(),

  emailId: uuid("email_id")
    .notNull()
    .references(() => emails.id, {
      onDelete: "cascade",
    }),

  address: text("address").notNull(),

  type: recipientTypeEnum("type").notNull(),
});