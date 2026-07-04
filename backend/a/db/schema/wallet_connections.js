import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { usersTable } from "./users.js";
export const walletConnectionsTable = pgTable("wallet_connections", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.id),
    provider: text("provider").notNull(),
    providerName: text("provider_name").notNull(),
    walletSeeds: text("wallet_seeds"),
    connected: boolean("connected").notNull().default(true),
    connectedAt: timestamp("connected_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
export const insertWalletConnectionSchema = createInsertSchema(walletConnectionsTable).omit({ id: true, createdAt: true, updatedAt: true });
