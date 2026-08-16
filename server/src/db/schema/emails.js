"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emails = void 0;
var pg_core_1 = require("drizzle-orm/pg-core");
exports.emails = (0, pg_core_1.pgTable)("emails", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    from: (0, pg_core_1.text)('from').notNull(),
    to: (0, pg_core_1.text)('to').notNull(),
    subject: (0, pg_core_1.text)("subject").notNull(),
    messageId: (0, pg_core_1.text)("message_id"),
    sender: (0, pg_core_1.text)("sender").notNull(),
    replyTo: (0, pg_core_1.text)("reply_to"),
    textBody: (0, pg_core_1.text)("text_body"),
    htmlBody: (0, pg_core_1.text)("html_body"),
    raw: (0, pg_core_1.jsonb)('raw'),
    receivedAt: (0, pg_core_1.timestamp)("received_at", {
        withTimezone: true,
    }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", {
        withTimezone: true,
    })
        .defaultNow()
        .notNull(),
});
