import {
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const emails = pgTable("emails", {
  id: uuid("id").defaultRandom().primaryKey(),

  messageId: text("message_id"),

  sender: text("sender").notNull(),

  replyTo: text("reply_to"),

  subject: text("subject").notNull(),

  textBody: text("text_body"),

  htmlBody: text("html_body"),

  receivedAt: timestamp("received_at", {
    withTimezone: true,
  }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});