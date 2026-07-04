import { pgTable, text, serial, timestamp, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const siteSettingsTable = pgTable("site_settings", {
    id: serial("id").primaryKey(),
    siteName: text("site_name").notNull().default("AsRInvest"),
    siteEmail: text("site_email").notNull().default("admin@asrinvest.com"),
    siteUrl: text("site_url"),
    logoUrl: text("logo_url"),
    faviconUrl: text("favicon_url"),
    currency: text("currency").notNull().default("USD"),
    minDeposit: numeric("min_deposit", { precision: 20, scale: 8 }).notNull().default("10"),
    maxDeposit: numeric("max_deposit", { precision: 20, scale: 8 }).notNull().default("1000000"),
    minWithdrawal: numeric("min_withdrawal", { precision: 20, scale: 8 }).notNull().default("10"),
    maxWithdrawal: numeric("max_withdrawal", { precision: 20, scale: 8 }).notNull().default("100000"),
    withdrawalFee: numeric("withdrawal_fee", { precision: 10, scale: 4 }).notNull().default("2.5"),
    maintenanceMode: boolean("maintenance_mode").notNull().default(false),
    emailNotificationsEnabled: boolean("email_notifications_enabled").notNull().default(false),
    identityVerificationEnabled: boolean("identity_verification_enabled").notNull().default(false),
    walletConnectionRequired: boolean("wallet_connection_required").notNull().default(false),
    welcomeBonus: numeric("welcome_bonus", { precision: 20, scale: 8 }).notNull().default("0"),
    referralBonus: numeric("referral_bonus", { precision: 10, scale: 4 }).notNull().default("0"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
export const insertSiteSettingsSchema = createInsertSchema(siteSettingsTable).omit({ id: true, updatedAt: true });
