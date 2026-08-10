
import {
  integer,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { emails } from "./emails";

export const emailAttachments = pgTable("email_attachments", {
  id: uuid("id").defaultRandom().primaryKey(),

  emailId: uuid("email_id")
    .notNull()
    .references(() => emails.id, {
      onDelete: "cascade",
    }),

  filename: text("filename").notNull(),

  contentType: text("content_type"),

  size: integer("size").notNull(),

  path: text("path").notNull(),

  contentId: text("content_id"),
});