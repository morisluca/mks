import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { usersTable } from "./users.js";
export const verificationTable = pgTable("verifications", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    idDocumentUrl: text("id_document_url").notNull(),
    selfieUrl: text("selfie_url"),
    status: text("status").notNull().default("pending"),
    adminNotes: text("admin_notes"),
    rejectionReason: text("rejection_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    reviewedBy: integer("reviewed_by").references(() => usersTable.id),
});
export const insertVerificationSchema = createInsertSchema(verificationTable).omit({ id: true, createdAt: true, updatedAt: true, reviewedAt: true, reviewedBy: true });
