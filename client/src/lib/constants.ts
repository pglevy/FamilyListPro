import { Category } from "@shared/schema";

export const CATEGORIES = {
  PRODUCE: "produce",
  DAIRY: "dairy",
  MEAT: "meat",
  BAKERY: "bakery",
  FROZEN: "frozen",
  PANTRY: "pantry",
  HOUSEHOLD: "household",
} as const;

export const CATEGORY_ICONS: Record<Category, { icon: string; color: string }> =
  {
    produce: { icon: "apple-alt", color: "green" },
    dairy: { icon: "cheese", color: "blue" },
    meat: { icon: "drumstick-bite", color: "red" },
    bakery: { icon: "bread-slice", color: "yellow" },
    frozen: { icon: "snowflake", color: "blue" },
    pantry: { icon: "box", color: "yellow" },
    household: { icon: "home", color: "purple" },
  };

export const LIST_TYPES = {
  TO_BUY: "tobuy",
  FAVORITES: "favorites",
  NEVER_BUY: "neverbuy",
} as const;
