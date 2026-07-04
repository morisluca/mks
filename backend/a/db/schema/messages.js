import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { usersTable } from "./users.js";

export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  adminId: integer("admin_id").notNull().references(() => usersTable.id),
  title: text("title").notNull(),
  body: text("body").notNull(),
  sender: text("sender").notNull().default("admin"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertMessageSchema = createInsertSchema(messagesTable).omit({ id: true, createdAt: true, updatedAt: true });
