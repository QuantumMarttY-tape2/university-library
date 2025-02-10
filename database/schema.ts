import { uuid, varchar, integer, text, boolean, date, pgTable, pgEnum, timestamp } from "drizzle-orm/pg-core";

// Array of different strings that are possible answers to that status.
export const STATUS_ENUM = pgEnum("status", ["PENDING", "APPROVED", "REJECTED"]);

export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);

export const BORROW_STATUS_ENUM = pgEnum("borrow_status", ["BORROWED", "RETURNED"]);

export const users = pgTable("users", {
    // uuid means unique identifier.
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),

    // varchar means a list of characters.
    // Here in SQL databases, you typically go for blah_blah not blahBlah.
    fullName: varchar("full_name", { length: 255 }).notNull(),

    email: text("email").notNull().unique(),
    universityId: integer("university_id").notNull().unique(),
    password: text("password").notNull(),
    universityCard: text("university_card").notNull(),

    // status itself is an enum.
    status: STATUS_ENUM("status").default("PENDING"),
    role: ROLE_ENUM("role").default("USER"),

    lastActivityDate: date("last_activity_date").defaultNow(),
    createdAt: timestamp("created_at", {
        withTimezone: true
    }).defaultNow(),
});
