import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const platforms = pgTable("platforms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // facebook, instagram, etc.
  connected: boolean("connected").default(false),
  metrics: text("metrics").default("{}"),
});

export const scheduledPosts = pgTable("scheduled_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  platformId: integer("platform_id").notNull(),
  content: text("content").notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  status: text("status").default("pending"),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  platformId: integer("platform_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  platformId: integer("platform_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPlatformSchema = createInsertSchema(platforms);
export const insertScheduledPostSchema = createInsertSchema(scheduledPosts);
export const insertNoteSchema = createInsertSchema(notes);
export const insertWishlistSchema = createInsertSchema(wishlist);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Platform = typeof platforms.$inferSelect;
export type ScheduledPost = typeof scheduledPosts.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Wishlist = typeof wishlist.$inferSelect;