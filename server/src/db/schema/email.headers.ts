import {
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { emails } from "./emails";

export const emailHeaders = pgTable("email_headers", {
  id: uuid("id").defaultRandom().primaryKey(),

  emailId: uuid("email_id")
    .notNull()
    .references(() => emails.id, {
      onDelete: "cascade",
    }),

  name: text("name").notNull(),

  value: text("value").notNull(),
});