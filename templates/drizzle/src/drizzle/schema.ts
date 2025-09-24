import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fname: varchar("fname", { length: 255 }).notNull(),
  lname: varchar("lname", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const userCredentialsTable = pgTable("credentials", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .unique(),
  passwordHash: varchar("hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
