import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// List types
export const LIST_TYPES = {
  TO_BUY: 'tobuy',
  FAVORITES: 'favorites',
  NEVER_BUY: 'neverbuy'
} as const;

export type ListType = typeof LIST_TYPES[keyof typeof LIST_TYPES];

// Store categories
export const CATEGORIES = {
  PRODUCE: 'produce',
  DAIRY: 'dairy',
  MEAT: 'meat',
  BAKERY: 'bakery',
  FROZEN: 'frozen',
  PANTRY: 'pantry',
  HOUSEHOLD: 'household'
} as const;

export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];

// Schema for grocery items
export const groceryItems = pgTable("grocery_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  listType: text("list_type").notNull(),
  note: text("note"),
  purchased: boolean("purchased").default(false),
});

// Insert schema for grocery items
export const insertGroceryItemSchema = createInsertSchema(groceryItems).pick({
  name: true,
  category: true,
  listType: true,
  note: true,
  purchased: true,
});

export type InsertGroceryItem = z.infer<typeof insertGroceryItemSchema>;
export type GroceryItem = typeof groceryItems.$inferSelect;
