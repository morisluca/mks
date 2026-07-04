import { pgTable, text, serial, timestamp, numeric, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const plansTable = pgTable("plans", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    roi: numeric("roi", { precision: 10, scale: 4 }).notNull(),
    durationDays: integer("duration_days").notNull(),
    minAmount: numeric("min_amount", { precision: 20, scale: 8 }).notNull(),
    maxAmount: numeric("max_amount", { precision: 20, scale: 8 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
export const insertPlanSchema = createInsertSchema(plansTable).omit({ id: true, createdAt: true, updatedAt: true });
