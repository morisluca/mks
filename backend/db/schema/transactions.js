import { pgTable, text, serial, timestamp, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { usersTable } from "./users.js";
export const transactionsTable = pgTable("transactions", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.id),
    type: text("type").notNull(),
    amount: numeric("amount", { precision: 20, scale: 8 }).notNull(),
    currency: text("currency").notNull().default("USD"),
    walletAddress: text("wallet_address"),
    txHash: text("tx_hash"),
    status: text("status").notNull().default("pending"),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({ id: true, createdAt: true, updatedAt: true });
