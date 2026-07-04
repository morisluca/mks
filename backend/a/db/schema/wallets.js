import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const depositWalletsTable = pgTable("deposit_wallets", {
    id: serial("id").primaryKey(),
    currency: text("currency").notNull(),
    network: text("network").notNull(),
    address: text("address").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    qrCode: text("qr_code"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
export const insertDepositWalletSchema = createInsertSchema(depositWalletsTable).omit({ id: true, createdAt: true, updatedAt: true });
