import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb
} from "drizzle-orm/pg-core";

export const emails = pgTable("emails", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  from: text('from').notNull(),
  
  to: text('to').notNull(),
  
  subject: text("subject").notNull(),
  
  messageId: text("message_id"),

  sender: text("sender").notNull(),

  replyTo: text("reply_to"),

  textBody: text("text_body"),

  htmlBody: text("html_body"),
  
  raw: jsonb('raw'),

  receivedAt: timestamp("received_at", {
    withTimezone: true,
  }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});