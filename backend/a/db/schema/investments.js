import { pgTable, text, serial, timestamp, numeric, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { usersTable } from "./users.js";
import { plansTable } from "./plans.js";
export const investmentsTable = pgTable("investments", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.id),
    planId: integer("plan_id").notNull().references(() => plansTable.id),
    planName: text("plan_name").notNull(),
    amount: numeric("amount", { precision: 20, scale: 8 }).notNull(),
    roi: numeric("roi", { precision: 10, scale: 4 }).notNull(),
    durationDays: integer("duration_days").notNull(),
    expectedReturn: numeric("expected_return", { precision: 20, scale: 8 }).notNull(),
    status: text("status").notNull().default("pending"),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
export const insertInvestmentSchema = createInsertSchema(investmentsTable).omit({ id: true, createdAt: true, updatedAt: true });
