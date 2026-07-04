import { pgTable, text, serial, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    username: text("username").notNull().unique(),
    fullName: text("full_name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("user"),
    balance: numeric("balance", { precision: 20, scale: 8 }).notNull().default("0"),
    bonusBalance: numeric("bonus_balance", { precision: 20, scale: 8 }).notNull().default("0"),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
    // Personal Information (Optional)
    title: text("title"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    dateOfBirth: timestamp("date_of_birth"),
    // Financial Information (Optional)
    currency: text("currency"),
    employmentStatus: text("employment_status"),
    sourceOfIncome: text("source_of_income"),
    industry: text("industry"),
    annualIncome: text("annual_income"),
    estimatedNetWorth: text("estimated_net_worth"),
    // Address Information (Optional)
    streetAddress: text("street_address"),
    city: text("city"),
    provinceState: text("province_state"),
    postalZipCode: text("postal_zip_code"),
    phoneNumber: text("phone_number"),
});
export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
